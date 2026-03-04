"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    children: [
      { label: "Dedicated Teams", href: "/services/dedicated-teams" },
      { label: "On-Demand Support", href: "/services/on-demand-support" },
      { label: "Business Care Plans", href: "/services/business-care-plans" },
    ],
  },
  {
    label: "Solutions",
    children: [
      { label: "Insurance", href: "/solutions/insurance" },
      { label: "Finance & Accounting", href: "/solutions/finance-accounting" },
      { label: "HR Management", href: "/solutions/hr-management" },
      { label: "Compliance & Admin", href: "/solutions/compliance-admin" },
    ],
  },
  { label: "Blog", href: "/blog" },
  {
    label: "About Us",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Team", href: "/team" },
      { label: "Careers", href: "/careers" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "FAQ", href: "/faq" },
    ],
  },
];

export default function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(72);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track scroll position for header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Measure header height dynamically
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  function toggleDropdown(label: string) {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, label: string) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        toggleDropdown(label);
        break;
      case "Escape":
        setOpenDropdown(null);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (openDropdown !== label) {
          setOpenDropdown(label);
        }
        break;
    }
  }, [openDropdown]);

  // Desktop hover handlers
  const handleMouseEnter = (label: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 border-b bg-white transition-all duration-300 ${
          isScrolled
            ? "border-gray-200 shadow-md"
            : "border-transparent shadow-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/header-logo.png"
              alt="Backsure Global Support - Bridging Borders"
              width={200}
              height={56}
              style={{ width: "auto", height: 52 }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            ref={navRef}
            className="hidden items-center gap-1 lg:flex"
            role="menubar"
            aria-label="Main navigation"
          >
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    onKeyDown={(e) => handleKeyDown(e, item.label)}
                    className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-navy-50 hover:text-gold ${
                      item.children.some((c) => isActive(c.href))
                        ? "text-gold"
                        : "text-navy"
                    }`}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    role="menuitem"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Dropdown with animation */}
                  <div
                    className={`absolute left-0 top-full mt-1 min-w-[200px] rounded-lg bg-white py-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
                      openDropdown === item.label
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0"
                    }`}
                    role="menu"
                    aria-label={`${item.label} submenu`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block px-4 py-2 text-sm transition-colors hover:bg-navy-50 hover:text-navy ${
                          isActive(child.href)
                            ? "font-semibold text-navy"
                            : "text-gray-700"
                        }`}
                        role="menuitem"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-navy-50 hover:text-gold ${
                    isActive(item.href) ? "text-gold" : "text-navy"
                  }`}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              )
            )}

            {/* CTA Buttons */}
            <Link
              href="/contact"
              className="ml-4 rounded-md bg-gold px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-dark"
            >
              Contact Us
            </Link>
            <Link
              href="/calculator"
              className="ml-2 rounded-md bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
            >
              Efficiency Calculator
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-navy hover:bg-navy-50 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ top: headerHeight }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu */}
        <div
          className={`fixed right-0 z-50 h-[calc(100vh-var(--header-height))] w-72 transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={
            {
              top: headerHeight,
              "--header-height": `${headerHeight}px`,
              height: `calc(100vh - ${headerHeight}px)`,
            } as React.CSSProperties
          }
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="flex flex-col overflow-y-auto p-4">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-navy hover:bg-navy-50"
                    aria-expanded={openDropdown === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`ml-4 overflow-hidden border-l border-navy-100 pl-3 transition-all duration-200 ${
                      openDropdown === item.label
                        ? "max-h-96 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors hover:bg-navy-50 ${
                          isActive(child.href)
                            ? "font-medium text-gold"
                            : "text-gray-600"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-md px-3 py-3 text-sm font-medium hover:bg-navy-50 ${
                    isActive(item.href) ? "text-gold" : "text-navy"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            <hr className="my-4 border-gray-200" />

            <Link
              href="/contact"
              className="rounded-md bg-gold px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gold-dark"
            >
              Contact Us
            </Link>
            <Link
              href="/calculator"
              className="mt-2 rounded-md bg-navy px-4 py-3 text-center text-sm font-medium text-white hover:bg-navy-dark"
            >
              Efficiency Calculator
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
