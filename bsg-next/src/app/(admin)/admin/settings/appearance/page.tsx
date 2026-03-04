import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { Palette } from "lucide-react";
import { SettingsForm } from "../SettingsForm";

export const metadata = { title: "Appearance Settings" };

export default async function AppearanceSettingsPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch all settings from database
  const settingsRows = await prisma.settings.findMany({
    where: { setting_group: "appearance" },
    orderBy: { setting_key: "asc" },
  });

  // Group settings by group
  const settingsMap: Record<string, Record<string, string>> = {};
  settingsRows.forEach((row) => {
    if (!settingsMap[row.setting_group]) {
      settingsMap[row.setting_group] = {};
    }
    settingsMap[row.setting_group][row.setting_key] = row.setting_value || "";
  });

  // Define appearance section
  const section = {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    description: "Visual customization and branding",
    fields: [
      { key: "primary_color", label: "Primary Color", type: "text", group: "appearance" },
      { key: "secondary_color", label: "Secondary Color", type: "text", group: "appearance" },
      { key: "logo_url", label: "Logo URL", type: "text", group: "appearance" },
      { key: "favicon_url", label: "Favicon URL", type: "text", group: "appearance" },
    ],
  };

  // Get current values for all fields
  const currentValues: Record<string, string> = {};
  section.fields.forEach((field) => {
    const group = settingsMap[field.group] || {};
    currentValues[`${field.group}.${field.key}`] = group[field.key] || "";
  });

  return (
    <>
      <PageHeader
        title="Appearance Settings"
        description="Customize the visual appearance of your site"
      />

      <Card>
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
    </>
  );
}
