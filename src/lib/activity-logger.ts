import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type ActionType = 
  | "login"
  | "logout"
  | "create"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "import"
  | "status_change";

interface LogActivityParams {
  actionType: ActionType;
  action: string;
  page?: string;
  resource?: string;
  resourceId?: number;
  details?: string;
}

/**
 * Log an admin activity
 */
export async function logActivity({
  actionType,
  action,
  page,
  resource,
  resourceId,
  details,
}: LogActivityParams) {
  try {
    const session = await getServerSession(authOptions);
    const headersList = headers();
    
    const userId = session?.user?.id ? parseInt(session.user.id) : null;
    const username = session?.user?.name || session?.user?.email || "Unknown";
    const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0] || 
                      headersList.get("x-real-ip") || 
                      "Unknown";
    const userAgent = headersList.get("user-agent") || null;

    await prisma.admin_activity_log.create({
      data: {
        user_id: userId,
        username: username.substring(0, 50),
        action_type: actionType,
        action: action.substring(0, 255),
        page: page?.substring(0, 255),
        resource: resource?.substring(0, 50),
        resource_id: resourceId,
        details: details,
        ip_address: ipAddress.substring(0, 45),
        user_agent: userAgent,
      },
    });
  } catch (error) {
    // Log error but don't throw - activity logging shouldn't break the app
    console.error("Failed to log activity:", error);
  }
}

/**
 * Log a candidate status change
 */
export async function logCandidateStatusChange(
  candidateId: number,
  candidateName: string,
  oldStatus: string,
  newStatus: string
) {
  return logActivity({
    actionType: "status_change",
    action: `Changed status from "${oldStatus}" to "${newStatus}"`,
    resource: "candidate",
    resourceId: candidateId,
    details: JSON.stringify({ candidateName, oldStatus, newStatus }),
  });
}

/**
 * Log an inquiry status change
 */
export async function logInquiryStatusChange(
  inquiryId: number,
  inquiryName: string,
  oldStatus: string,
  newStatus: string
) {
  return logActivity({
    actionType: "status_change",
    action: `Changed inquiry status from "${oldStatus}" to "${newStatus}"`,
    resource: "inquiry",
    resourceId: inquiryId,
    details: JSON.stringify({ inquiryName, oldStatus, newStatus }),
  });
}

/**
 * Log blog post actions
 */
export async function logBlogAction(
  postId: number,
  postTitle: string,
  actionType: "create" | "update" | "delete"
) {
  const actionMap = {
    create: `Created blog post "${postTitle}"`,
    update: `Updated blog post "${postTitle}"`,
    delete: `Deleted blog post "${postTitle}"`,
  };

  return logActivity({
    actionType,
    action: actionMap[actionType],
    resource: "blog_post",
    resourceId: postId,
    details: JSON.stringify({ postTitle }),
  });
}

/**
 * Log settings changes
 */
export async function logSettingsChange(
  settingGroup: string,
  changes: Record<string, unknown>
) {
  return logActivity({
    actionType: "update",
    action: `Updated ${settingGroup} settings`,
    resource: "settings",
    details: JSON.stringify(changes),
  });
}

/**
 * Log data export
 */
export async function logDataExport(exportType: string) {
  return logActivity({
    actionType: "export",
    action: `Exported ${exportType} data`,
    resource: exportType,
  });
}
