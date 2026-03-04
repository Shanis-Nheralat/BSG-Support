import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Human Resource Management",
  description:
    "End-to-end HR operations support to manage your workforce efficiently.",
};

export default function HRManagementPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Human Resource Management",
        subtitle:
          "Reliable HR Back-Office Support to Build and Retain Great Teams",
      }}
      intro="At BackSure Global Support, we provide end-to-end HR operations support designed to help businesses manage their workforce more efficiently. Whether you're scaling your team or optimizing internal processes, our HR back-office services take care of the routine tasks so you can focus on strategy, culture, and employee growth."
      servicesTitle="Our Core Services"
      services={[
        {
          title: "Payroll Processing",
          desc: "Accurate and timely payroll calculations, salary disbursements, and payslip generation — fully compliant with local labor laws and internal policies.",
        },
        {
          title: "Attendance & Leave Management",
          desc: "Monitor work hours, manage shift schedules, and track leave balances with automated tools like Zoho People, aligned with UAE or regional HR policies.",
        },
        {
          title: "Employee Onboarding / Offboarding",
          desc: "From offer letters to exit formalities — manage documentation, system access, ID generation, and clearances for smooth employee transitions.",
        },
        {
          title: "Performance Tracking Support",
          desc: "Set up performance KPIs, track progress, organize review cycles, and implement efficient appraisal workflows aligned with organizational goals.",
        },
        {
          title: "Statutory Benefits Calculation",
          desc: "Accurately calculate gratuity, end-of-service benefits, social insurance, and statutory obligations based on contract type and tenure.",
        },
      ]}
      benefitsTitle="Why It Matters"
      benefits={[
        {
          title: "Reduce HR Workload & Human Errors",
          desc: "Automated and well-managed processes reduce administrative overheads and prevent mistakes in payroll or benefits.",
        },
        {
          title: "Compliance & Documentation Control",
          desc: "All HR functions performed in compliance with UAE Labor Laws and regional statutory requirements.",
        },
        {
          title: "Improve Employee Experience",
          desc: "Seamless onboarding and transparent HR practices boost morale, retention, and team satisfaction.",
        },
      ]}
      audience={[
        "Growing companies building their HR operations from scratch",
        "Businesses expanding into the UAE or GCC region",
        "SMEs without a dedicated HR department",
        "Organizations seeking to streamline existing HR processes",
      ]}
      cta={{
        headline: "Empower Your Team with Seamless HR Support",
        text: "Partner with BSG Support for reliable and efficient HR management — so you can build stronger teams without the operational stress.",
        button: "Request a Consultation",
      }}
    />
  );
}
