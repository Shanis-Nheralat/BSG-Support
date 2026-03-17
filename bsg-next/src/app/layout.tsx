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
    "Expert outsourcing solutions for insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
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
    images: [
      {
        url: `${SITE_URL}/images/bsg-icon.png`,
        width: 512,
        height: 512,
        alt: "Backsure Global Support Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Backsure Global Support",
    description:
      "Expert outsourcing solutions for insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
    images: [`${SITE_URL}/images/bsg-icon.png`],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Backsure Global Support",
  url: SITE_URL,
  logo: `${SITE_URL}/images/bsg-icon.png`,
  image: `${SITE_URL}/images/bsg-icon.png`,
  description:
    "Expert outsourcing solutions for insurance, finance, HR and compliance — bridging borders from Dubai and Bangalore.",
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
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
