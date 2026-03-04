import ServicePageTemplate from "@/components/ServicePageTemplate";

export const metadata = {
  title: "Dedicated Employee Support",
  description:
    "Full-time, dedicated professionals working exclusively for your business — without the overhead.",
};

export default function DedicatedTeamsPage() {
  return (
    <ServicePageTemplate
      hero={{
        title: "Dedicated Employee Support",
        subtitle: "Your Team. Our Infrastructure. No Boundaries.",
      }}
      intro="Imagine having a skilled, full-time team working exclusively for you — without the overhead of setting up operations abroad. With BSG Support's Dedicated Employee Model, you get highly trained professionals based in India who seamlessly integrate into your business."
      servicesTitle="What You Get"
      services={[
        {
          title: "Full-Time, Dedicated Professionals",
          desc: "Exclusive access to skilled team members for sales, underwriting, administration, data entry, and customer support — working solely for your business.",
        },
        {
          title: "Aligned to Your Working Hours",
          desc: "Your team works according to your time zone, enabling real-time communication and seamless collaboration with your local team.",
        },
        {
          title: "Handpicked Candidates",
          desc: "A structured hiring process with client involvement ensures each team member matches your requirements and cultural fit.",
        },
        {
          title: "Complete Infrastructure Management",
          desc: "We handle all infrastructure, payroll, HR, and compliance — you focus solely on managing work outputs and business results.",
        },
      ]}
      benefitsTitle="Why It Works"
      benefits={[
        {
          title: "Lower Operational Costs",
          desc: "Significantly reduce expenses while maintaining high-quality service delivery.",
        },
        {
          title: "Full Control Over Your Remote Team",
          desc: "Maintain complete oversight and direction — like local staff but without administrative burden.",
        },
        {
          title: "Quick Scale-Up Capabilities",
          desc: "Easily expand your team based on project demands without hiring complexities.",
        },
        {
          title: "100% Transparency & Performance Tracking",
          desc: "Clear visibility into team activities and metrics to ensure accountability.",
        },
      ]}
      audience={[
        "Businesses looking to expand operational capacity without increasing local headcount",
        "Companies seeking cost-effective solutions for skilled professional services",
        "Organizations with ongoing, consistent operational needs",
        "Businesses wanting dedicated support across sales, admin, and customer service",
      ]}
      cta={{
        headline: "Build Your Dream Team — Without Borders",
        text: "Let's set up your dedicated back-office powerhouse, built to grow with you.",
        button: "Get Started Today",
      }}
    />
  );
}
