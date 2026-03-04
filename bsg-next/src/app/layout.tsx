import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import ThemeProvider from "@/components/providers/ThemeProvider";
import "./globals.css";

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
  openGraph: {
    type: "website",
    siteName: "Backsure Global Support",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
