import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Settings, Mail, Globe } from "lucide-react";
import { SettingsForm } from "../SettingsForm";

export const metadata = { title: "General Settings" };

export default async function GeneralSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch all settings from database
  const settingsRows = await prisma.settings.findMany({
    orderBy: [{ setting_group: "asc" }, { setting_key: "asc" }],
  });

  // Group settings by group
  const settingsMap: Record<string, Record<string, string>> = {};
  settingsRows.forEach((row) => {
    if (!settingsMap[row.setting_group]) {
      settingsMap[row.setting_group] = {};
    }
    settingsMap[row.setting_group][row.setting_key] = row.setting_value || "";
  });

  // Define setting sections - General, Contact, Company
  const sections = [
    {
      id: "general",
      title: "General Settings",
      icon: Settings,
      description: "Basic site configuration",
      fields: [
        { key: "site_name", label: "Site Name", type: "text", group: "general" },
        { key: "site_tagline", label: "Tagline", type: "text", group: "general" },
        { key: "site_description", label: "Site Description", type: "textarea", group: "general" },
        { key: "timezone", label: "Timezone", type: "text", group: "general" },
      ],
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: Mail,
      description: "Contact details displayed on the website",
      fields: [
        { key: "contact_email", label: "Contact Email", type: "email", group: "contact" },
        { key: "contact_phone", label: "Phone Number", type: "text", group: "contact" },
        { key: "contact_address", label: "Address", type: "textarea", group: "contact" },
        { key: "social_linkedin", label: "LinkedIn URL", type: "url", group: "social" },
        { key: "social_twitter", label: "Twitter URL", type: "url", group: "social" },
      ],
    },
    {
      id: "company",
      title: "Company Details",
      icon: Globe,
      description: "Business information",
      fields: [
        { key: "company_name", label: "Company Name", type: "text", group: "company" },
        { key: "company_registration", label: "Registration Number", type: "text", group: "company" },
        { key: "company_vat", label: "VAT Number", type: "text", group: "company" },
      ],
    },
  ];

  // Get current values for all fields
  const currentValues: Record<string, string> = {};
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      const group = settingsMap[field.group] || {};
      currentValues[`${field.group}.${field.key}`] = group[field.key] || "";
    });
  });

  return (
    <>
      <PageHeader
        title="General Settings"
        description="Manage site, contact, and company configuration"
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-gray-400" />
                  {section.title}
                </div>
              </CardTitle>
            </CardHeader>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {section.description}
            </p>
            <SettingsForm
              sectionId={section.id}
              fields={section.fields}
              currentValues={currentValues}
            />
          </Card>
        ))}
      </div>
    </>
  );
}
