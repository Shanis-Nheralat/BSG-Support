"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Job {
  id: number;
  title: string;
}

interface CareersApplicationFormProps {
  jobs: Job[];
}

export function CareersApplicationForm({ jobs }: CareersApplicationFormProps) {
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Pre-select job from URL if provided
  useEffect(() => {
    const jobParam = searchParams.get("job");
    if (jobParam && jobs.some((j) => j.id === parseInt(jobParam))) {
      setSelectedJobId(jobParam);
    }
  }, [searchParams, jobs]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Combine first and last name
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    formData.set("name", `${firstName} ${lastName}`.trim());
    formData.delete("firstName");
    formData.delete("lastName");

    // Add job_id if a job is selected
    if (selectedJobId) {
      formData.set("job_id", selectedJobId);
    }

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit application");
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <h3 className="font-poppins text-xl font-semibold text-green-800">
          Application Received!
        </h3>
        <p className="mt-2 text-green-700">
          Thank you for your interest. Our HR team will review your
          application and get back to you.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm text-green-600 underline hover:text-green-800"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-xl border border-gray-200 bg-white p-8"
    >
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First Name" name="firstName" required />
        <Input label="Last Name" name="lastName" required />
      </div>
      <Input label="Email Address" name="email" type="email" required />
      <Input label="Phone Number" name="phone" type="tel" required />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Position You&apos;re Applying For
        </label>
        <select 
          name="position"
          value={selectedJobId ? jobs.find((j) => j.id === parseInt(selectedJobId))?.title || "General Application" : ""}
          onChange={(e) => {
            const selectedValue = e.target.value;
            // Clear job_id for General Application
            if (selectedValue === "General Application") {
              setSelectedJobId("");
            } else {
              const job = jobs.find((j) => j.title === selectedValue);
              setSelectedJobId(job ? String(job.id) : "");
            }
          }}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy-100"
          required
        >
          <option value="">Select a position...</option>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <option key={job.id} value={job.title}>
                {job.title}
              </option>
            ))
          ) : (
            <option value="General Application">General Application</option>
          )}
          {jobs.length > 0 && (
            <option value="General Application">General Application (Other)</option>
          )}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Upload Resume (PDF, DOC, DOCX - Max 5MB)
        </label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-navy hover:file:bg-navy-100"
        />
      </div>
      <Button type="submit" loading={submitting} className="w-full">
        <Send className="h-4 w-4" /> Submit Application
      </Button>
    </form>
  );
}
