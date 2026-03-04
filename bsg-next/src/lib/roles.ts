import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Role hierarchy - higher index = more permissions
const ROLE_HIERARCHY = ["viewer", "editor", "admin", "super_admin"];

export type Role = "viewer" | "editor" | "admin" | "super_admin";

/**
 * Get current user's role from session
 */
export async function getUserRole(): Promise<Role | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) return null;
  return session.user.role as Role;
}

/**
 * Check if user has at least the minimum required role
 */
export function hasMinimumRole(userRole: Role | null, requiredRole: Role): boolean {
  if (!userRole) return false;
  const userIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  return userIndex >= requiredIndex;
}

/**
 * Check if current user has at least the minimum required role
 */
export async function checkRole(requiredRole: Role): Promise<{
  authorized: boolean;
  role: Role | null;
}> {
  const role = await getUserRole();
  return {
    authorized: hasMinimumRole(role, requiredRole),
    role,
  };
}

/**
 * Role requirements for different blog operations
 */
export const BLOG_ROLES = {
  READ: "editor" as Role,      // Can view all posts in admin
  CREATE: "editor" as Role,    // Can create new posts
  UPDATE: "editor" as Role,    // Can update posts
  DELETE: "admin" as Role,     // Only admins can delete
  PUBLISH: "editor" as Role,   // Can publish posts
};

/**
 * Role requirements for category operations
 */
export const CATEGORY_ROLES = {
  READ: "editor" as Role,
  CREATE: "editor" as Role,
  UPDATE: "admin" as Role,
  DELETE: "admin" as Role,
};
