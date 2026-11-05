"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav } from "@/config/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { getLenis } from "@/hooks/useLenis";

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}
const getScrolled = () => window.scrollY > 8;
const getServerScrolled = () => false;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(subscribeScroll, getScrolled, getServerScrolled);
  // The menu is bound to the route it was opened on, so any navigation (links, back/forward) closes it.
  const [menu, setMenu] = useState<{ open: boolean; path: string }>({ open: false, path: "" });
  const open = menu.open && menu.path === pathname;

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenu({ open: false, path: "" });
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prev;
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeMenu = () => setMenu({ open: false, path: "" });

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background transition-[border-color,box-shadow] duration-300 ${
        scrolled || open ? "border-border shadow-[0_6px_24px_-18px_rgba(24,31,28,0.35)]" : "border-transparent"
      }`}
      style={{ height: "var(--navbar-height)" }}
    >
      <div className="container-wide grid h-full grid-cols-[1fr_auto] items-center lg:grid-cols-[1fr_auto_1fr]">
        <div className="justify-self-start">
          <Logo />
        </div>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="label-sub group relative inline-block py-2 text-[0.95rem] text-foreground"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-accent transition-transform duration-300 ease-out ${
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <div className="hidden lg:block">
            <Button href="/contact" className="!min-h-11 !px-6 !py-2.5">
              Book an Appointment
            </Button>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setMenu(open ? { open: false, path: "" } : { open: true, path: pathname })}
            className="relative grid h-12 w-12 place-items-center rounded-full border border-foreground/25 text-foreground lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <motion.span
                className="absolute left-0 top-0 block h-[2px] w-5 rounded bg-current"
                animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
              <motion.span
                className="absolute left-0 top-[6px] block h-[2px] w-5 rounded bg-current"
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="absolute left-0 top-3 block h-[2px] w-5 rounded bg-current"
                animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
                transition={{ duration: 0.25 }}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent=""
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-border bg-background lg:hidden"
            style={{ maxHeight: "calc(100svh - var(--navbar-height))", overflowY: "auto" }}
          >
            <nav aria-label="Mobile" className="container-wide py-6">
              <ul className="flex flex-col">
                {mainNav.map((item, i) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.05, duration: 0.3 }}
                      className="border-b border-border last:border-b-0"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className="flex min-h-16 items-center justify-between font-heading text-3xl text-foreground"
                      >
                        <span>{item.label}</span>
                        <span
                          aria-hidden="true"
                          className={`h-2 w-2 rounded-full ${active ? "bg-accent" : "bg-transparent"}`}
                        />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="mt-6" onClick={closeMenu}>
                <Button href="/contact" full>
                  Let&apos;s Talk
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
