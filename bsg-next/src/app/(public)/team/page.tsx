import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Our Team",
  description: "Meet the team behind Backsure Global Support.",
};

const leadership = [
  {
    initials: "MS",
    name: "Muhammed Shanis Nheralat",
    role: "Founder",
    email: "shanisnheralat@gmail.com",
    bio: "Brings deep experience in supporting fast-scaling startups and enterprises, with expertise across backend operations, outsourcing models, and team building.",
  },
];

const departments = [
  {
    title: "Operations Team",
    desc: "Our operations specialists handle day-to-day delivery across insurance, finance, HR, and compliance — ensuring accuracy, consistency, and speed for every client engagement.",
  },
  {
    title: "Client Success Team",
    desc: "Dedicated relationship managers who serve as your single point of contact, ensuring seamless onboarding, clear communication, and continuous improvement.",
  },
  {
    title: "Technology & Systems",
    desc: "Our tech team manages secure infrastructure, CRM integrations, and automation tools that enable efficient workflows and real-time collaboration with clients.",
  },
  {
    title: "HR & Talent Acquisition",
    desc: "Responsible for sourcing, training, and retaining top talent — ensuring every team member we place meets the highest professional standards.",
  },
];

export default function TeamPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-poppins text-4xl font-bold lg:text-5xl">
            Meet the Team
          </h1>
          <p className="mt-4 text-lg text-white/70">
            Our strength lies in our people. We bring together driven
            professionals who are passionate about simplifying operations and
            driving growth for our clients.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Leadership
          </h2>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-1">
            {leadership.map((member) => (
              <div
                key={member.name}
                className="rounded-xl border border-gray-200 p-8 text-center"
              >
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-navy text-3xl font-bold text-white">
                  {member.initials}
                </div>
                <h3 className="font-poppins text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="mt-1 font-medium text-gold">{member.role}</p>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600">
                  {member.bio}
                </p>
                <a
                  href={`mailto:${member.email}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm text-navy hover:text-gold"
                >
                  <Mail className="h-4 w-4" />
                  {member.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-poppins text-3xl font-bold text-gray-900">
            Our Departments
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Behind every successful client partnership is a structured team of
            specialists working across key business functions.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {departments.map((dept) => (
              <div
                key={dept.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  {dept.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {dept.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-gold py-12">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h2 className="font-poppins text-2xl font-bold text-white">
            Want to Join Our Team?
          </h2>
          <p className="mt-2 text-white/80">
            We&apos;re always looking for talented individuals who share our
            passion for operational excellence.
          </p>
          <Link
            href="/careers"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-dark"
          >
            View Open Positions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
