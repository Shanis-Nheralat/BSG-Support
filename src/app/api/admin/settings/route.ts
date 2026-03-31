import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get all settings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await prisma.settings.findMany({
      orderBy: [{ setting_group: "asc" }, { setting_key: "asc" }],
    });

    // Group settings by group
    const grouped: Record<string, Record<string, string>> = {};
    settings.forEach((s) => {
      if (!grouped[s.setting_group]) {
        grouped[s.setting_group] = {};
      }
      grouped[s.setting_group][s.setting_key] = s.setting_value || "";
    });

    return NextResponse.json({ settings: grouped });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { settings } = body as {
      settings: Array<{ group: string; key: string; value: string }>;
    };

    if (!settings || !Array.isArray(settings)) {
      return NextResponse.json(
        { error: "Invalid settings data" },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);

    // Upsert each setting
    const promises = settings.map((setting) =>
      prisma.settings.upsert({
        where: {
          setting_group_setting_key: {
            setting_group: setting.group,
            setting_key: setting.key,
          },
        },
        update: {
          setting_value: setting.value,
          updated_by: userId,
          updated_at: new Date(),
        },
        create: {
          setting_group: setting.group,
          setting_key: setting.key,
          setting_value: setting.value,
          type: "text",
          autoload: true,
          updated_by: userId,
          updated_at: new Date(),
        },
      })
    );

    await Promise.all(promises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
