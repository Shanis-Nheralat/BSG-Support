"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface JobData {
  id?: number;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience: string | null;
  salary_range: string | null;
  description: string;
  requirements: string | null;
  benefits: string | null;
  status: string;
  featured: boolean;
}

interface JobFormProps {
  job?: JobData;
  departments: string[];
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

const LOCATIONS = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Remote",
  "Hybrid - Dubai",
  "Hybrid - Abu Dhabi",
];

export function JobForm({ job, departments: existingDepartments }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [useCustomDepartment, setUseCustomDepartment] = useState(false);

  const isEditing = !!job?.id;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const department = useCustomDepartment 
      ? customDepartment 
      : (formData.get("department") as string);

    const data = {
      title: formData.get("title") as string,
      department,
      location: formData.get("location") as string,
      employment_type: formData.get("employment_type") as string,
      experience: formData.get("experience") as string || null,
      salary_range: formData.get("salary_range") as string || null,
      description: formData.get("description") as string,
      requirements: formData.get("requirements") as string || null,
      benefits: formData.get("benefits") as string || null,
      status: formData.get("status") as string,
      featured: formData.get("featured") === "on",
    };

    try {
      const url = isEditing ? `/api/admin/jobs/${job.id}` : "/api/admin/jobs";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save job");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Job Details
            </h3>
            <div className="space-y-4">
              <Input
                label="Job Title"
                name="title"
                required
                defaultValue={job?.title || ""}
                placeholder="e.g., Senior Software Engineer"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Department *
                  </label>
                  {useCustomDepartment ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customDepartment}
                        onChange={(e) => setCustomDepartment(e.target.value)}
                        placeholder="Enter department name"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setUseCustomDepartment(false)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        name="department"
                        required={!useCustomDepartment}
                        defaultValue={job?.department || ""}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select Department</option>
                        {existingDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Operations">Operations</option>
                        <option value="Sales">Sales</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setUseCustomDepartment(true)}
                        className="rounded-lg bg-navy-600 px-3 py-2 text-sm text-white hover:bg-navy-700"
                        title="Add custom department"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location *
                  </label>
                  <select
                    name="location"
                    required
                    defaultValue={job?.location || ""}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Location</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Employment Type *
                  </label>
                  <select
                    name="employment_type"
                    required
                    defaultValue={job?.employment_type || ""}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  >
                    <option value="">Select Type</option>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Experience Required"
                  name="experience"
                  defaultValue={job?.experience || ""}
                  placeholder="e.g., 3-5 years"
                />
              </div>

              <Input
                label="Salary Range"
                name="salary_range"
                defaultValue={job?.salary_range || ""}
                placeholder="e.g., AED 15,000 - 25,000 / month"
              />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Job Description
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={6}
                  required
                  defaultValue={job?.description || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  rows={6}
                  defaultValue={job?.requirements || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="List the required skills, qualifications, and experience (one per line)..."
                />
                <p className="mt-1 text-xs text-gray-500">Enter each requirement on a new line</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Benefits
                </label>
                <textarea
                  name="benefits"
                  rows={4}
                  defaultValue={job?.benefits || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="List the benefits and perks (one per line)..."
                />
                <p className="mt-1 text-xs text-gray-500">Enter each benefit on a new line</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Publish
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={job?.status || "draft"}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={job?.featured || false}
                  className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                  Featured job posting
                </label>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link href="/admin/jobs" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Tips
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Use clear, specific job titles</li>
              <li>List requirements in order of importance</li>
              <li>Include salary range to attract more candidates</li>
              <li>Highlight unique benefits and perks</li>
              <li>Set to &ldquo;Published&rdquo; to make visible on careers page</li>
            </ul>
          </Card>
        </div>
      </div>
    </form>
  );
}
