import "server-only";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface MeetupPastEventsResult { ok: boolean; status: number; data?: any }

// Sends the full GraphQL query instead of a persisted-query hash. Meetup
// rotates those hashes without notice, and a stale hash comes back as
// HTTP 200 + `PersistedQueryNotFound` — which left the Events page showing
// "No past events found" whenever Meetup rejected it. The full query needs
// no MEETUP_API_TOKEN. Fields match what EventCard and the events page read.
const PAST_EVENTS_QUERY = `
  query getPastGroupEvents($urlname: String!) {
    groupByUrlname(urlname: $urlname) {
      events(status: PAST, first: 100, sort: DESC) {
        totalCount
        edges {
          node {
            id
            title
            dateTime
            eventUrl
            eventType
            description
            going { totalCount }
            displayPhoto { highResUrl }
          }
        }
      }
    }
  }
`;

// Meetup's unofficial gql2 API occasionally returns a transient 401/503 even
// with valid credentials — this never caches the response, so a bad attempt
// never gets frozen in place for callers.
export async function fetchMeetupPastEvents(): Promise<MeetupPastEventsResult> {
  const payload = {
    operationName: 'getPastGroupEvents',
    query: PAST_EVENTS_QUERY,
    variables: {
      urlname: 'aws-sbg-at-srm-inst-of-science-tech-kattankulathur',
    },
  };

  const response = await fetch('https://www.meetup.com/gql2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (!response.ok) {
    return { ok: false, status: response.status };
  }

  const data = await response.json();
  // GraphQL reports failures as HTTP 200 with an `errors` array. Treat that as
  // a failure so getPastEventEdges retries instead of rendering "no events".
  if (data?.errors) {
    console.error('Meetup API returned errors', JSON.stringify(data.errors).slice(0, 300));
    return { ok: false, status: 502 };
  }
  return { ok: true, status: response.status, data };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPastEventEdges(attempt = 1): Promise<any[]> {
  const result = await fetchMeetupPastEvents();
  if (!result.ok) {
    console.error('Meetup API responded with non-OK status', result.status);
    if (attempt < 2) return getPastEventEdges(attempt + 1);
    return [];
  }
  return result.data?.data?.groupByUrlname?.events?.edges ?? [];
}
