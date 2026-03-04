import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "On-Demand Service Support",
  description:
    "Flexible, task-based support for urgent tasks, seasonal demands, or one-time projects.",
};

export default function OnDemandSupportPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "On-Demand Service Support",
        subtitle: "Expert Help, Only When You Need It",
      }}
      intro="Need reliable help for urgent tasks, seasonal demands, or one-time projects? With BackSure Global Support's On-Demand Service Model, you get flexible, task-based support — zero long-term commitment."
      servicesTitle="Where We Help"
      services={[
        {
          title: "PRO and Documentation Services",
          desc: "Professional assistance with document preparation, attestation, and government-related processes — we handle the paperwork so you can focus on business.",
        },
        {
          title: "Regulatory & Compliance Filings",
          desc: "Stay compliant with local regulations through timely submissions and filings, ensuring your business meets all legal requirements.",
        },
        {
          title: "Financial Reports & VAT/Tax Submissions",
          desc: "Assistance with financial statement preparation, VAT returns, and tax documentation — ensuring accuracy and timeliness.",
        },
        {
          title: "Business Licensing & Renewals",
          desc: "License applications, renewals, and regulatory paperwork to keep your operations running smoothly.",
        },
      ]}
      benefitsTitle="Why Choose On-Demand"
      benefits={[
        {
          title: "Fast Turnaround",
          desc: "Quick results with a responsive team ready to handle urgent and time-sensitive tasks.",
        },
        {
          title: "Pay Only for What You Use",
          desc: "Cost-effective task-based pricing — no overhead, no wasted resources.",
        },
        {
          title: "No Long-Term Contracts",
          desc: "Complete flexibility with zero commitment. Use services as much or as little as needed.",
        },
        {
          title: "Access Skilled Professionals Instantly",
          desc: "Tap into a pool of experienced professionals with industry-specific expertise.",
        },
      ]}
      audience={[
        "Startups and SMEs with fluctuating workloads",
        "Businesses facing temporary staff shortages",
        "Companies with seasonal administrative peaks",
        "Teams needing specialized expertise for specific projects",
      ]}
      cta={{
        headline: "Flexibility Meets Reliability",
        text: "Perfect for urgent needs or when your team is overwhelmed — just send a request, and we'll take care of the rest.",
        button: "Get On-Demand Support Now",
      }}
    />
  );
}
