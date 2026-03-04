import React from 'react';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

const footerLinks = [
  { label: 'About Us', href: 'https://backsureglobalsupport.com/about' },
  { label: 'Careers', href: 'https://backsureglobalsupport.com/careers' },
  { label: 'Blog', href: 'https://backsureglobalsupport.com/blog' },
  { label: 'Contact Us', href: 'https://backsureglobalsupport.com/contact' },
  { label: 'Data Security', href: 'https://backsureglobalsupport.com/data-security' },
  { label: 'FAQ', href: 'https://backsureglobalsupport.com/faq' },
];

const serviceLinks = [
  { label: 'Dedicated Teams', href: 'https://backsureglobalsupport.com/services/dedicated-teams' },
  { label: 'On-Demand Support', href: 'https://backsureglobalsupport.com/services/on-demand-support' },
  { label: 'Business Care Plans', href: 'https://backsureglobalsupport.com/services/business-care-plans' },
];

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com/61581961928821/' },
  { label: 'Instagram', href: 'https://www.instagram.com/backsure_globalsupport/' },
  { label: 'LinkedIn', href: 'https://ae.linkedin.com/company/backsure-global-support' },
];

export default function BSGFooter() {
  return (
    <footer className="bsg-footer bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Locations */}
          <div>
            <a href="https://backsureglobalsupport.com/" className="mb-4 inline-block">
              <img
                src="/images/logo.png"
                alt="Backsure Global Support"
                className="h-10 w-auto brightness-0 invert"
              />
            </a>
            <p className="mb-6 text-sm italic text-gold">Bridging Borders</p>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-white">Dubai, UAE</p>
                  <p>Paradise Building, Barsha Heights, Dubai, United Arab Emirates</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <div>
                  <p className="font-medium text-white">India</p>
                  <p>Corporate Court, #108 Infantry Road, Bangalore - 560 001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold font-poppins">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold font-poppins">
              Our Services
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold font-poppins">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+971524419445"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  +971 52-441-9445
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@backsureglobalsupport.com"
                  className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-gold"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  info@backsureglobalsupport.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row lg:px-8">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Backsure Global Support. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
