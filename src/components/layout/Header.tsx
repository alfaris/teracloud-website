"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { nav } from "@/content/site";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Home starts over the dark 3D hero; the header turns solid once you scroll past it.
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Close the menu on navigation (adjusting state during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300",
        overHero ? "on-dark bg-transparent text-white" : open ? "bg-white text-ink" : "bg-white/90 text-ink shadow-[0_1px_0_var(--tc-line)] backdrop-blur-md",
      )}
    >
      <div className="container-tc flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="relative z-10 shrink-0" aria-label="Teracloud home">
          <Logo tone={overHero ? "white" : "blue"} className="pointer-events-none" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "relative rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors",
                    overHero ? "text-white/80 hover:text-white" : "text-ink/75 hover:text-blue",
                    isActive(item.href) && (overHero ? "text-white" : "text-blue"),
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span aria-hidden className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-current" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/contact?intent=partnership"
            className={clsx(
              "hidden min-h-11 items-center rounded-full px-5 text-[0.9375rem] font-semibold transition-colors sm:inline-flex",
              overHero ? "bg-white text-ink hover:bg-blue-50" : "bg-blue text-white hover:bg-blue-700",
            )}
          >
            Partner with us
          </Link>
          <button
            ref={buttonRef}
            type="button"
            className="relative z-10 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span className={clsx("absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform duration-300", open && "translate-y-[5px] rotate-45")} />
              <span className={clsx("absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300", open && "-translate-y-[5px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

    </header>
      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-0 top-[var(--header-h)] z-40 overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="container-tc py-8">
          <ul className="divide-y divide-line">
            {[{ href: "/", label: "Home" }, ...nav, { href: "/locations", label: "Locations" }, { href: "/contact", label: "Contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname === item.href || (item.href !== "/" && isActive(item.href)) ? "page" : undefined}
                  className="flex items-center justify-between py-4 text-2xl font-bold tracking-tight text-ink aria-[current=page]:text-blue"
                >
                  {item.label}
                  <span aria-hidden className="text-gray">→</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact?intent=partnership"
            className="mt-8 flex min-h-12 items-center justify-center rounded-full bg-blue font-semibold text-white"
          >
            Partner with us
          </Link>
        </nav>
      </div>
    </>
  );
}
