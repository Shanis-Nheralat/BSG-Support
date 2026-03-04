import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Compliance & Business Administration",
  description:
    "Stay legally compliant, operate efficiently, and grow confidently with BSG Support.",
};

export default function ComplianceAdminPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Compliance & Business Administration",
        subtitle:
          "Stay Legally Compliant. Operate Efficiently. Grow Confidently.",
      }}
      intro="At BackSure Global Support, we understand that managing compliance and business administration can be complex, time-consuming, and risky if not handled properly. Our dedicated team ensures your business remains aligned with all legal, operational, and regulatory standards, so you can focus on your core operations and expansion."
      servicesTitle="Our Key Services"
      services={[
        {
          title: "Company Formation & Licensing Support",
          desc: "Assist in registering your business and obtaining necessary trade licenses, permits, and approvals — for startups, SMEs, and expanding enterprises.",
        },
        {
          title: "Trade License Renewals",
          desc: "Never miss a renewal deadline. We track and manage the entire renewal process to ensure uninterrupted operations and avoid penalties.",
        },
        {
          title: "Document Preparation & PRO Services",
          desc: "Draft agreements, handle government documentation, and facilitate seamless authority interaction through experienced PROs.",
        },
        {
          title: "Regulatory Compliance Support",
          desc: "Stay ahead of evolving regulations including AML, GDPR, and jurisdiction-specific compliance standards with accurate reporting and monitoring frameworks.",
        },
      ]}
      benefitsTitle="Why It Matters"
      benefits={[
        {
          title: "Avoid Fines and Legal Risks",
          desc: "We monitor deadlines and ensure all filings and procedures are up to date.",
        },
        {
          title: "Reduce Administrative Burden",
          desc: "Let our team manage the paperwork while your team focuses on strategy and growth.",
        },
        {
          title: "Gain Peace of Mind",
          desc: "BackSure handles your compliance with professionals who understand local regulations and global standards.",
        },
      ]}
      audience={[
        "New ventures requiring company formation and licensing",
        "Businesses needing ongoing PRO and compliance support",
        "International companies expanding into UAE/GCC markets",
        "Organizations managing complex regulatory requirements",
      ]}
      cta={{
        headline: "Ensure Compliance, Stay in Control",
        text: "Partner with BackSure Global Support to simplify your compliance journey and maintain full operational integrity.",
        button: "Request a Consultation",
      }}
    />
  );
}
