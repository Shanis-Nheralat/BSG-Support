import { prisma } from "@/lib/prisma";

export type NotificationType = "info" | "success" | "warning" | "error";

interface CreateNotificationParams {
  type?: NotificationType;
  title: string;
  message?: string;
  link?: string;
  userId?: number;
}

/**
 * Create a new admin notification
 */
export async function createNotification({
  type = "info",
  title,
  message,
  link,
  userId,
}: CreateNotificationParams) {
  try {
    return await prisma.admin_notifications.create({
      data: {
        type,
        title,
        message,
        link,
        user_id: userId,
        is_read: false,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
    return null;
  }
}

/**
 * Create notification for new candidate application
 */
export async function notifyNewCandidate(candidateName: string, position: string, candidateId: number) {
  return createNotification({
    type: "info",
    title: "New Application",
    message: `${candidateName} applied for ${position}`,
    link: `/admin/candidates/${candidateId}`,
  });
}

/**
 * Create notification for new inquiry
 */
export async function notifyNewInquiry(name: string, formType: string, inquiryId: number) {
  const typeLabel = formType === "meeting_request" 
    ? "meeting request" 
    : formType === "service_intake" 
      ? "service inquiry" 
      : "inquiry";
  
  return createNotification({
    type: "info",
    title: "New Inquiry",
    message: `${name} submitted a ${typeLabel}`,
    link: `/admin/inquiries/${inquiryId}`,
  });
}

/**
 * Create notification for new blog comment (future use)
 */
export async function notifyNewBlogComment(postTitle: string, commenterName: string) {
  return createNotification({
    type: "info",
    title: "New Comment",
    message: `${commenterName} commented on "${postTitle}"`,
    link: "/admin/blog",
  });
}

/**
 * Create system notification
 */
export async function notifySystem(title: string, message: string, type: NotificationType = "warning") {
  return createNotification({
    type,
    title,
    message,
  });
}

export async function notifyNewBooking(visitorName: string, date: string, time: string, bookingId: number) {
  return createNotification({
    type: "info",
    title: "New Meeting Booked",
    message: `${visitorName} booked a meeting on ${date} at ${time}`,
    link: `/admin/schedule/${bookingId}`,
  });
}
