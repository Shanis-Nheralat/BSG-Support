import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { JobApplicationForm } from "./JobApplicationForm";

interface JobDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: JobDetailPageProps) {
  const job = await prisma.job_postings.findUnique({
    where: { slug: params.slug },
  });

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `${job.title} - Careers`,
    description: job.description.substring(0, 160),
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await prisma.job_postings.findUnique({
    where: { slug: params.slug },
  });

  if (!job || job.status !== "published") {
    notFound();
  }

  // Parse requirements and benefits (stored as newline-separated text)
  const requirements = job.requirements
    ? job.requirements.split("\n").filter((r) => r.trim())
    : [];
  const benefits = job.benefits
    ? job.benefits.split("\n").filter((b) => b.trim())
    : [];

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-16 text-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <Link
            href="/careers"
            className="mb-6 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all jobs
          </Link>

          {job.featured && (
            <span className="mb-4 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
              Featured Position
            </span>
          )}

          <h1 className="font-poppins text-3xl font-bold lg:text-4xl">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/70">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {job.department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              {job.employment_type}
            </span>
            {job.experience && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {job.experience}
              </span>
            )}
            {job.salary_range && (
              <span className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                {job.salary_range}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div>
                <h2 className="font-poppins text-xl font-semibold text-gray-900">
                  About the Role
                </h2>
                <div className="mt-4 prose prose-gray max-w-none">
                  <p className="whitespace-pre-wrap text-gray-600">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              {requirements.length > 0 && (
                <div>
                  <h2 className="font-poppins text-xl font-semibold text-gray-900">
                    Requirements
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {benefits.length > 0 && (
                <div>
                  <h2 className="font-poppins text-xl font-semibold text-gray-900">
                    What We Offer
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                        <span className="text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar - Application Form */}
            <div>
              <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-poppins text-lg font-semibold text-gray-900">
                  Apply for this position
                </h3>
                <JobApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
