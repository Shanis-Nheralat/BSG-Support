import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Business Care Plans",
  description:
    "Comprehensive all-in-one back-office support from payroll to compliance.",
};

export default function BusinessCarePlansPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Business Care Plans",
        subtitle:
          "Streamline Your Administrative Functions with All-in-One Support",
      }}
      intro="At BackSure Global Support, our Business Care Plans provide a comprehensive solution for your back-office needs. From payroll to compliance, we handle the administrative work so you can focus on growing your business and serving your customers."
      servicesTitle="What's Included"
      services={[
        {
          title: "Payroll Processing",
          desc: "Accurate and timely monthly payroll — salary calculations, deductions, electronic payslips, fully compliant with local labor laws and company policies.",
        },
        {
          title: "Bookkeeping & Financial Reports",
          desc: "Regular bookkeeping services including transaction recording, account reconciliations, and essential financial reports for clear visibility into performance.",
        },
        {
          title: "HR Records Management",
          desc: "Comprehensive management of employee records, attendance tracking, leave management, and documentation of HR processes.",
        },
        {
          title: "Compliance & PRO Services",
          desc: "PRO services, document processing, and compliance monitoring to help you navigate complex local regulations and operate with confidence.",
        },
      ]}
      benefitsTitle="Why Choose Our Business Care Plans"
      benefits={[
        {
          title: "Simplified Administration",
          desc: "Single point of contact for all back-office needs — reduce complexity and administrative burden.",
        },
        {
          title: "Cost-Effective Solution",
          desc: "Predictable monthly costs with no hidden fees. Control expenses while receiving professional support.",
        },
        {
          title: "Scalable As You Grow",
          desc: "Plans adapt to your evolving business needs — easy to scale support as your company expands.",
        },
      ]}
      audience={[
        "Growing startups wanting to focus on core business",
        "Established SMEs looking to streamline operations",
        "International companies expanding into new regions",
        "Businesses without dedicated administrative departments",
      ]}
      cta={{
        headline: "Focus on Growth. We'll Handle the Rest.",
        text: "Let BackSure Global Support take care of your administrative functions while you concentrate on what matters most — growing your business.",
        button: "Get a Custom Business Care Plan",
      }}
    />
  );
}
