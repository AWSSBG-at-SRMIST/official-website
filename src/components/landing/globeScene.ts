// The WebGL globe itself. Loaded on demand by GlobeAnimation (dynamic
// import), so three.js is only downloaded once the page is idle and only on
// devices that get the animated globe.
import {
  AmbientLight,
  Group,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  Mesh,
  Vector3,
  WebGLRenderer,
} from "three";

// ─── Interaction State Machine ────────────────────────────────────────────────
// IDLE       → globe rotates autonomously at a slow constant speed
// PROXIMITY  → cursor is within ~40% of the screen from the globe center;
//              globe starts gently tracking the cursor
// ACTIVE     → cursor is close and moving; globe rotates with cursor velocity
// MOMENTUM   → cursor left the area; globe coasts using the last velocity,
//              decaying back toward IDLE speed
type GlobeState = "idle" | "proximity" | "active" | "momentum";

const NODE_COUNT = 55;

// Speeds and easing below were tuned per frame at 60fps. Motion now scales
// by real elapsed time, so the globe spins at the same speed on 60Hz, 120Hz
// and throttled frames alike.
const FRAME_60 = 1000 / 60;
// While idle the globe only drifts slowly; 30fps looks the same and halves
// the GPU work. Cursor interaction runs at the display's full rate.
const IDLE_FRAME_MS = 1000 / 30;

export function createGlobe(container: HTMLElement, onFirstFrame: () => void): () => void {
  // ── Renderer & Scene ────────────────────────────────────────────────────
  const scene = new Scene();
  const camera = new PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  // 1.5x instead of 2x on high-density screens: ~44% fewer pixels to shade
  // for a thin wireframe where the difference isn't visible.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(renderer.domElement);

  const resize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener("resize", resize);

  // ── Lights ──────────────────────────────────────────────────────────────
  scene.add(new AmbientLight(0xffffff, 0.6));

  const lightsGroup = new Group();
  const violetLight = new PointLight(0xa855f7, 4, 12);
  violetLight.position.set(4, 4, 4);
  lightsGroup.add(violetLight);
  const accentLight = new PointLight(0xd946ef, 2, 8);
  accentLight.position.set(-3, -2, 3);
  lightsGroup.add(accentLight);
  scene.add(lightsGroup);

  // ── Globe Mesh ──────────────────────────────────────────────────────────
  const geo = new SphereGeometry(2.8, 64, 64);
  // Phong instead of MeshPhysicalMaterial: the physical shader is three.js's
  // most expensive, and on a 30%-opacity wireframe its extra terms don't
  // show. Base colour and highlights are tuned so the globe's measured
  // brightness in a screenshot matches the old material's.
  const mat = new MeshPhongMaterial({
    color: 0x554e6e,
    specular: 0x9d91ca,
    shininess: 100,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const globe = new Mesh(geo, mat);
  scene.add(globe);

  // Inner glow sphere
  const coreGeo = new SphereGeometry(2.72, 32, 32);
  const coreMat = new MeshPhongMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.1,
    shininess: 120,
  });
  scene.add(new Mesh(coreGeo, coreMat));

  // Orbiting dot nodes — one InstancedMesh (1 draw call) instead of 55
  // separate meshes (55 draw calls every frame).
  const nodesGroup = new Group();
  const nodeGeo = new SphereGeometry(0.025, 8, 8);
  const nodeMat = new MeshBasicMaterial({ color: 0xd946ef });
  const nodes = new InstancedMesh(nodeGeo, nodeMat, NODE_COUNT);
  const m = new Matrix4();
  const p = new Vector3();
  for (let i = 0; i < NODE_COUNT; i++) {
    const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
    const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
    p.setFromSphericalCoords(3.05, phi, theta);
    nodes.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z));
  }
  nodesGroup.add(nodes);
  scene.add(nodesGroup);

  // ── Interaction State ───────────────────────────────────────────────────
  let state: GlobeState = "idle";

  // Velocity the globe is actually rotating at right now
  const vel = { x: 0, y: 0.0015 }; // start with a gentle idle spin

  // "Inertia" bucket – the last known cursor velocity
  const cursorVel = { x: 0, y: 0 };
  let lastMouseX = 0;
  let lastMouseY = 0;

  // When cursor left, we freeze vel here and decay from it
  const momentumStart = { x: 0, y: 0 };
  let momentumT = 0; // [0,1] decay progress

  // Idle target speed
  const IDLE_VY = 0.0015;
  const IDLE_VX = 0.0003;

  // Proximity radius: fraction of viewport width from globe screen centre
  const PROXIMITY_FRAC = 0.38;

  // Track whether the globe is visible (via IntersectionObserver)
  let isVisible = false;

  // ── Mouse tracking ──────────────────────────────────────────────────────
  const handleMouseMove = (e: MouseEvent) => {
    if (!isVisible) return;

    const rect = container.getBoundingClientRect();
    // Globe screen center (container is offset right on large screens)
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const proximityPx = window.innerWidth * PROXIMITY_FRAC;

    // Compute cursor velocity (normalized screen units)
    const rawDVX = (e.clientX - lastMouseX) / window.innerWidth;
    const rawDVY = (e.clientY - lastMouseY) / window.innerHeight;
    // Low-pass filter to smooth jitter
    cursorVel.x = cursorVel.x * 0.6 + rawDVX * 0.4;
    cursorVel.y = cursorVel.y * 0.6 + rawDVY * 0.4;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (dist < proximityPx) {
      // Within interaction radius
      const influence = 1 - dist / proximityPx; // 0..1, stronger toward centre
      state = influence > 0.1 ? "active" : "proximity";
    } else if (state === "active" || state === "proximity") {
      // Cursor left – capture momentum and start decay
      momentumStart.x = vel.x;
      momentumStart.y = vel.y;
      momentumT = 0;
      state = "momentum";
    }
  };

  const handleMouseLeave = () => {
    if (state === "active" || state === "proximity") {
      momentumStart.x = vel.x;
      momentumStart.y = vel.y;
      momentumT = 0;
      state = "momentum";
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeave);

  // ── IntersectionObserver – pause when off-screen ────────────────────────
  let animationFrameId = 0;
  let isPaused = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isPaused) {
          isPaused = false;
          lastTime = performance.now();
          animationFrameId = requestAnimationFrame(animate);
        } else if (!isVisible) {
          isPaused = true;
          cancelAnimationFrame(animationFrameId);
          // Return to idle so it starts cleanly next time
          state = "idle";
        }
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  // ── Animation Loop ──────────────────────────────────────────────────────
  let time = 0;
  let lastTime = performance.now();
  let firstFrame = true;

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // A per-60fps-frame lerp factor, corrected for however many 60fps frames
  // actually elapsed (k), so easing takes the same wall-clock time.
  const ease = (a: number, k: number) => 1 - Math.pow(1 - a, k);

  const animate = (now: number) => {
    if (isPaused) return;
    animationFrameId = requestAnimationFrame(animate);
    if (state === "idle" && !firstFrame && now - lastTime < IDLE_FRAME_MS) return;

    const k = Math.min(4, (now - lastTime) / FRAME_60);
    lastTime = now;
    time += 0.005 * k;

    // Slowly rotate lights for ambient depth
    lightsGroup.rotation.y = time * 0.6;
    lightsGroup.rotation.z = time * 0.3;

    // ── State machine: compute target velocity ──────────────────────────
    switch (state) {
      case "idle": {
        // Smoothly ease toward constant idle spin
        vel.x = lerp(vel.x, IDLE_VX, ease(0.04, k));
        vel.y = lerp(vel.y, IDLE_VY, ease(0.04, k));
        break;
      }

      case "proximity": {
        // Very gentle influence — barely nudges the idle rotation
        const targetVY = lerp(IDLE_VY, cursorVel.x * 0.15, 0.15);
        const targetVX = lerp(IDLE_VX, -cursorVel.y * 0.15, 0.15);
        vel.x = lerp(vel.x, targetVX, ease(0.025, k));
        vel.y = lerp(vel.y, targetVY, ease(0.025, k));
        break;
      }

      case "active": {
        // Soothing: low cap, slow lerp — feels like floating with the cursor
        const targetVY = Math.max(-0.018, Math.min(0.018, cursorVel.x * 0.6));
        const targetVX = Math.max(-0.014, Math.min(0.014, -cursorVel.y * 0.6));
        vel.x = lerp(vel.x, targetVX, ease(0.04, k));
        vel.y = lerp(vel.y, targetVY, ease(0.04, k));
        break;
      }

      case "momentum": {
        // Exponential decay from capture point back toward idle speed
        momentumT = Math.min(1, momentumT + 0.018 * k);
        // Ease-out cubic
        const decay = 1 - Math.pow(1 - momentumT, 3);
        vel.x = lerp(momentumStart.x, IDLE_VX, decay);
        vel.y = lerp(momentumStart.y, IDLE_VY, decay);
        if (momentumT >= 1) state = "idle";
        break;
      }
    }

    // Apply velocity to meshes
    globe.rotation.y += vel.y * k;
    globe.rotation.x += vel.x * k;
    nodesGroup.rotation.y += vel.y * 1.08 * k;
    nodesGroup.rotation.x += vel.x * 1.08 * k;
    nodesGroup.rotation.z += 0.0004 * k; // slow independent axis tilt

    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      onFirstFrame();
    }
  };

  // ── Cleanup ─────────────────────────────────────────────────────────────
  return () => {
    isPaused = true;
    cancelAnimationFrame(animationFrameId);
    observer.disconnect();
    window.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
    window.removeEventListener("resize", resize);
    geo.dispose();
    mat.dispose();
    coreGeo.dispose();
    coreMat.dispose();
    nodeGeo.dispose();
    nodeMat.dispose();
    nodes.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
