"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/ui";
import { Save } from "lucide-react";

interface SettingsField {
  key: string;
  label: string;
  type: string;
  group: string;
}

interface SettingsFormProps {
  sectionId: string;
  fields: SettingsField[];
  currentValues: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SettingsForm({ sectionId, fields, currentValues }: SettingsFormProps) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      const key = `${field.group}.${field.key}`;
      initial[key] = currentValues[key] || "";
    });
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // Prepare settings data
    const settings = fields.map((field) => ({
      group: field.group,
      key: field.key,
      value: values[`${field.group}.${field.key}`] || "",
    }));

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setMessage({ type: "success", text: "Settings saved successfully" });
      router.refresh();
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(fieldKey: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldKey]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const fieldKey = `${field.group}.${field.key}`;
          
          if (field.type === "textarea") {
            return (
              <div key={fieldKey} className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </label>
                <textarea
                  value={values[fieldKey] || ""}
                  onChange={(e) => handleChange(fieldKey, e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>
            );
          }

          return (
            <div key={fieldKey}>
              <Input
                label={field.label}
                type={field.type}
                value={values[fieldKey] || ""}
                onChange={(e) => handleChange(fieldKey, e.target.value)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
