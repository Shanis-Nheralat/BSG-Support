import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth(allowedRoles?: string[]) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = session.user.role;
    // Admins always have access
    if (userRole !== "admin" && !allowedRoles.includes(userRole)) {
      redirect("/admin/dashboard?error=unauthorized");
    }
  }

  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}
