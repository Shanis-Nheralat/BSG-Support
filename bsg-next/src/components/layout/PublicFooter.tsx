import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

// Social media icons as inline SVGs for proper branding
const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const footerLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
  { label: "Data Security", href: "/data-security" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
];

const serviceLinks = [
  { label: "Dedicated Teams", href: "/services/dedicated-teams" },
  { label: "On-Demand Support", href: "/services/on-demand-support" },
  { label: "Business Care Plans", href: "/services/business-care-plans" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/61581961928821/", icon: FacebookIcon },
  { label: "Instagram", href: "https://www.instagram.com/backsure_globalsupport/", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://ae.linkedin.com/company/backsure-global-support", icon: LinkedInIcon },
];

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Brand & Locations */}
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/footer-logo.png"
                alt="Backsure Global Support - Bridging Borders"
                width={200}
                height={56}
                style={{ width: 'auto', height: 52 }}
              />
            </Link>
            <div className="space-y-3 text-xs text-white/70">
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
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Quick Links
            </h3>
            <ul className="columns-2 gap-x-4 space-y-1.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Our Services
            </h3>
            <ul className="space-y-1.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/70 transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="tel:+971524419445"
                  className="flex items-center gap-2 text-xs text-white/70 transition-colors hover:text-gold"
                >
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  +971 52-441-9445
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@backsureglobalsupport.com"
                  className="flex items-center gap-2 text-xs text-white/70 transition-colors hover:text-gold break-all"
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row lg:px-8">
          <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
            <p className="text-xs text-white/50">
              &copy; {new Date().getFullYear()} Backsure Global Support. All rights
              reserved.
            </p>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <Link href="/privacy-policy" className="hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <span>|</span>
              <Link href="/terms" className="hover:text-gold transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-white"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
