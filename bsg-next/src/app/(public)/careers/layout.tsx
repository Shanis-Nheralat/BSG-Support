import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join the Backsure Global Support team. Explore open positions and apply today.",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
