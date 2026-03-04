import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Insurance Operations Support",
  description:
    "Tailored backend solutions for insurance brokers, aggregators, and TPAs.",
};

export default function InsurancePage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Insurance Operations Support",
        subtitle: "Tailored Solutions for Brokers, Aggregators, and TPAs",
      }}
      intro="At BackSure Global Support, we specialize in providing skilled backend teams for the insurance industry — supporting brokers, aggregators, and TPAs across Health, Motor, and Life segments. Whether you're a growing brokerage or an established aggregator, we help you scale operations without increasing overhead."
      servicesTitle="Our Specialized Services"
      services={[
        {
          title: "Sales Support",
          desc: "Lead follow-ups, policy explanations, and coordination between clients and insurers to improve conversion rates and free up your in-house sales team.",
        },
        {
          title: "Underwriting Assistance",
          desc: "Collect and verify customer documents, pre-screen applications, and coordinate with insurers for approvals.",
        },
        {
          title: "Policy Processing & Renewals",
          desc: "From new policy issuance to renewal cycles — complete process management including documentation, data entry, and timely follow-ups.",
        },
        {
          title: "Claims Coordination",
          desc: "Liaison between clients, insurers, and TPAs. We gather required documents, track claim statuses, and ensure smooth case resolution.",
        },
        {
          title: "CRM Management",
          desc: "Maintain clean and updated CRM records across Zoho CRM, Salesforce, or industry-specific systems — ensuring data accuracy and automation readiness.",
        },
        {
          title: "Quote Preparation",
          desc: "Assist in preparing comparative insurance quotes, collecting and organizing information from multiple partners to speed up decision-making.",
        },
        {
          title: "Data Entry & Reporting",
          desc: "Daily data updates, MIS reporting, and summary dashboards for sales, renewals, claims, and customer feedback — real-time insights for better management.",
        },
      ]}
      benefitsTitle="Why It Matters"
      benefits={[
        {
          title: "Industry-Trained Teams",
          desc: "Staff trained specifically for the insurance industry to reduce errors and increase turnaround speed.",
        },
        {
          title: "Operational Cost Savings",
          desc: "Scale your backend without hiring in-house — cost-effective solutions with performance accountability.",
        },
        {
          title: "Better Client Experience",
          desc: "Faster responses, fewer errors, and clean data ensure a smoother client journey from quote to claim.",
        },
      ]}
      audience={[
        "Insurance brokers looking to scale policy processing",
        "Aggregators managing multi-insurer coordination",
        "TPAs needing reliable claims processing support",
        "Insurance startups building operational capacity",
      ]}
      cta={{
        headline: "Insurance Support That Works Like Your In-House Team",
        text: "Choose BSG Support to power your insurance operations with reliable, trained, and performance-driven backend teams.",
        button: "Request a Consultation",
      }}
    />
  );
}
