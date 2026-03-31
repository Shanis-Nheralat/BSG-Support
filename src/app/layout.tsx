import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://backsureglobalsupport.com";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-opensans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Backsure Global Support",
    template: "%s | Backsure Global Support",
  },
  description:
    "Expert outsourcing solutions for technology solutions, insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    siteName: "Backsure Global Support",
    title: "Backsure Global Support — Expert Outsourcing Solutions",
    description:
      "Expert outsourcing solutions for technology solutions, insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/og-image.png`,
        width: 1792,
        height: 1024,
        alt: "Backsure Global Support — Scale Smarter. Grow Faster.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Backsure Global Support — Expert Outsourcing Solutions",
    description:
      "Expert outsourcing solutions for technology solutions, insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
    images: [`${SITE_URL}/images/og-image.png`],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Backsure Global Support",
  url: SITE_URL,
  logo: `${SITE_URL}/images/bsg-icon.png`,
  image: `${SITE_URL}/images/og-image.png`,
  description:
    "Expert outsourcing solutions for technology solutions, insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+971-52-441-9445",
    contactType: "customer service",
    email: "info@backsureglobalsupport.com",
  },
  sameAs: [
    "https://www.facebook.com/61581961928821/",
    "https://www.instagram.com/backsure_globalsupport/",
    "https://ae.linkedin.com/company/backsure-global-support",
  ],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Backsure Global Support",
  url: SITE_URL,
  image: `${SITE_URL}/images/og-image.png`,
  telephone: "+971-52-441-9445",
  email: "info@backsureglobalsupport.com",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Paradise Building, Barsha Heights",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Corporate Court, #108 Infantry Road",
      addressLocality: "Bangalore",
      postalCode: "560001",
      addressCountry: "IN",
    },
  ],
  description:
    "Expert outsourcing solutions for technology solutions, insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Business Process Outsourcing",
  provider: {
    "@type": "Organization",
    name: "Backsure Global Support",
  },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Outsourcing Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Dedicated Employee Support",
          description:
            "Full-time dedicated teams working exclusively for your business.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "On-Demand Service Support",
          description: "Expert help when you need it without the overhead.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Business Care Plans",
          description:
            "Back office management so you can focus on growth.",
        },
      },
    ],
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of businesses do you support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "From early-stage startups to enterprises, across all industries. Our flexible service models allow us to tailor our approach to your specific needs, regardless of your company size or sector.",
      },
    },
    {
      "@type": "Question",
      name: "How does your pricing structure work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Monthly billing. Flexible terms. Fully customized quotes. We offer transparent pricing based on the service model you choose and the level of support required.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Backsure different from other providers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We\u2019re a partner\u2014not just a service vendor. Measurable results and growth-focused. We position ourselves as a strategic partner focused on your business growth.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly can you start?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1\u20132 week onboarding depending on complexity. Faster for urgent needs. We begin with a thorough assessment, followed by process mapping and team alignment.",
      },
    },
    {
      "@type": "Question",
      name: "How do you ensure data security?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Global security protocols, encryption, and strict confidentiality measures. We implement industry-standard security practices and can adapt to your specific requirements.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      </head>
      <body
        className={`${poppins.variable} ${openSans.variable} font-opensans antialiased`}
      >
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
