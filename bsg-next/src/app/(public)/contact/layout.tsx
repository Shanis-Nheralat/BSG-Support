import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Backsure Global Support. Schedule a meeting or send us an inquiry.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
