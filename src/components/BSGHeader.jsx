import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';

const navItems = [
  { label: 'Home', href: 'https://backsureglobalsupport.com/' },
  {
    label: 'Services',
    children: [
      { label: 'Dedicated Teams', href: 'https://backsureglobalsupport.com/services/dedicated-teams' },
      { label: 'On-Demand Support', href: 'https://backsureglobalsupport.com/services/on-demand-support' },
      { label: 'Business Care Plans', href: 'https://backsureglobalsupport.com/services/business-care-plans' },
    ],
  },
  {
    label: 'Solutions',
    children: [
      { label: 'Insurance', href: 'https://backsureglobalsupport.com/solutions/insurance' },
      { label: 'Finance & Accounting', href: 'https://backsureglobalsupport.com/solutions/finance-accounting' },
      { label: 'HR Management', href: 'https://backsureglobalsupport.com/solutions/hr-management' },
      { label: 'Compliance & Admin', href: 'https://backsureglobalsupport.com/solutions/compliance-admin' },
    ],
  },
  {
    label: 'About Us',
    children: [
      { label: 'About Us', href: 'https://backsureglobalsupport.com/about' },
      { label: 'Team', href: 'https://backsureglobalsupport.com/team' },
      { label: 'Careers', href: 'https://backsureglobalsupport.com/careers' },
      { label: 'Testimonials', href: 'https://backsureglobalsupport.com/testimonials' },
      { label: 'FAQ', href: 'https://backsureglobalsupport.com/faq' },
    ],
  },
];

export default function BSGHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function toggleDropdown(label) {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }

  return (
    <header className="bsg-header sticky top-0 z-50 bg-navy text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <a href="https://backsureglobalsupport.com/" className="flex-shrink-0">
          <img
            src="/images/logo.png"
            alt="Backsure Global Support"
            className="h-10 w-auto"
          />
        </a>

        {/* Desktop Navigation */}
        <nav ref={navRef} className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-gold"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full mt-1 min-w-[200px] rounded-lg bg-white py-2 shadow-xl">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-navy-50 hover:text-navy"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-gold"
              >
                {item.label}
              </a>
            )
          )}

          {/* CTA Buttons */}
          <a
            href="https://backsureglobalsupport.com/contact"
            className="ml-4 rounded-md bg-gold px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-600"
          >
            Contact Us
          </a>
          <a
            href="https://backsureglobalsupport.com/login"
            className="ml-2 rounded-md border border-white/40 px-5 py-2 text-sm font-medium transition-colors hover:border-gold hover:text-gold"
          >
            Login
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-md p-2 hover:bg-white/10 lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[64px] z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed right-0 top-[64px] z-50 h-[calc(100vh-64px)] w-72 transform bg-navy shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col overflow-y-auto p-4">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex w-full items-center justify-between rounded-md px-3 py-3 text-sm font-medium hover:bg-white/10"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
                {openDropdown === item.label && (
                  <div className="ml-4 border-l border-white/20 pl-3">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        className="block rounded-md px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-3 text-sm font-medium hover:bg-white/10"
              >
                {item.label}
              </a>
            )
          )}

          <hr className="my-4 border-white/20" />

          <a
            href="https://backsureglobalsupport.com/contact"
            className="rounded-md bg-gold px-4 py-3 text-center text-sm font-semibold text-white hover:bg-gold-600"
          >
            Contact Us
          </a>
          <a
            href="https://backsureglobalsupport.com/login"
            className="mt-2 rounded-md border border-white/40 px-4 py-3 text-center text-sm font-medium hover:border-gold hover:text-gold"
          >
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
