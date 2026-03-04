import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Finance & Accounting",
  description:
    "Reliable, accurate, and scalable finance and accounting solutions for growing businesses.",
};

export default function FinanceAccountingPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Finance & Accounting",
        subtitle:
          "Designed to Streamline Your Financial Operations and Drive Smarter Decisions",
      }}
      intro="At BackSure Global Support, we offer reliable, accurate, and scalable finance and accounting solutions tailored for growing businesses. We take care of the numbers — so you can focus on growth, strategy, and execution."
      servicesTitle="Our Core Services"
      services={[
        {
          title: "Bookkeeping",
          desc: "Daily, weekly, or monthly bookkeeping services — recording and categorizing transactions using Zoho Books, QuickBooks, or Xero for full financial visibility.",
        },
        {
          title: "Accounts Payable & Receivable (AP/AR)",
          desc: "Manage payables for timely vendor payments and optimize receivables with consistent follow-ups and reconciliations to improve cash flow.",
        },
        {
          title: "VAT & Corporate Tax Filing Assistance",
          desc: "Ensure compliance with UAE VAT laws and Corporate Tax regulations. VAT registration, return filings, and CT preparation with tax advisors.",
        },
        {
          title: "Financial Reporting & Audit Support",
          desc: "Monthly and quarterly management reports — P&L statements, balance sheets, cash flow summaries customized to your needs, plus audit coordination.",
        },
        {
          title: "Budgeting and Forecasting",
          desc: "Support financial planning with realistic budget preparation, variance analysis, and rolling forecasts for informed decision-making.",
        },
      ]}
      benefitsTitle="Why It Matters"
      benefits={[
        {
          title: "Improved Accuracy & Transparency",
          desc: "Avoid errors with real-time access to financial data for better control and decision-making.",
        },
        {
          title: "Regulatory Compliance Made Easy",
          desc: "Stay aligned with local tax and financial regulations — zero last-minute surprises.",
        },
        {
          title: "Scalable Support for Growth",
          desc: "Our services evolve with your business, from early-stage startup to established enterprise.",
        },
      ]}
      audience={[
        "Startups needing professional bookkeeping from day one",
        "SMEs managing complex multi-currency transactions",
        "Businesses preparing for audits or tax filings",
        "Companies seeking to outsource their entire finance function",
      ]}
      cta={{
        headline: "Numbers Made Simple. Finances Done Right.",
        text: "Let BackSure Global Support manage your finance and accounting — so you can focus on running your business with clarity and confidence.",
        button: "Request a Consultation",
      }}
    />
  );
}
