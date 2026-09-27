"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../../../public/logo.png"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

const RECRUITMENTS_URL = "https://recruitments.awssbg-srmist.in";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const linkClass = (href: string) =>
    isLinkActive(href)
      ? "text-primary font-semibold border-b-2 border-primary transition-all duration-300 hover:-translate-y-0.5 inline-block"
      : "text-on-surface-variant hover:text-primary transition-all duration-300 hover:-translate-y-0.5 inline-block relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary hover:after:scale-x-100 after:transition-transform after:duration-300";

  const mobileLinkClass = (href: string) =>
    isLinkActive(href)
      ? "text-primary font-semibold block py-3"
      : "text-on-surface-variant hover:text-primary transition-colors duration-300 block py-3";

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b-2 border-on-surface/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 grid grid-cols-[auto_1fr_auto] lg:grid-cols-3 items-center">
        <Link
          className="font-headline-md text-sm font-bold text-on-surface transition-all duration-300 hover:opacity-80 flex justify-start items-center gap-2"
          href="/"
        >
          <Image src={Logo} alt="AWS Student Builder Group at SRMIST logo" className="h-8 w-8" />
          <span className="hidden md:block tracking-wide">AWS SBG at SRMIST</span>
        </Link>

        <div className="hidden lg:flex items-center justify-center gap-6 font-label-md text-xs uppercase tracking-wide">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkClass(link.href)}
              aria-current={isLinkActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex justify-end items-center gap-3">
          <a
            href={RECRUITMENTS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-block text-xs uppercase tracking-wide font-bold px-4 py-2 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300"
          >
            Recruitments
          </a>
          <button
            aria-label="Toggle menu"
            onClick={() => setIsOpen((v) => !v)}
            className="lg:hidden text-on-surface p-2.5"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t-2 border-on-surface/10 bg-surface/95 backdrop-blur-md"
          >
            <div className="flex flex-col px-margin-mobile py-2 gap-0 font-label-md text-sm uppercase tracking-wide">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={mobileLinkClass(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={RECRUITMENTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-primary font-bold block py-3"
              >
                Recruitments
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}