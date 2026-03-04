"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface JobApplicationFormProps {
  jobId: number;
  jobTitle: string;
}

export function JobApplicationForm({ jobId, jobTitle }: JobApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

    // Set job info
    formData.set("position", jobTitle);
    formData.set("job_id", String(jobId));

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
      <div className="mt-4 rounded-lg bg-green-50 p-4 text-center">
        <p className="font-medium text-green-800">Application Submitted!</p>
        <p className="mt-1 text-sm text-green-700">
          We&apos;ll review your application and get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="First Name"
          name="firstName"
          required
          placeholder="John"
        />
        <Input
          label="Last Name"
          name="lastName"
          required
          placeholder="Doe"
        />
      </div>

      <Input
        label="Email"
        name="email"
        type="email"
        required
        placeholder="john@example.com"
      />

      <Input
        label="Phone"
        name="phone"
        type="tel"
        required
        placeholder="+971 50 123 4567"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Resume (PDF, DOC, DOCX)
        </label>
        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          required
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-navy hover:file:bg-navy-100"
        />
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        <Send className="h-4 w-4" />
        Submit Application
      </Button>
    </form>
  );
}
