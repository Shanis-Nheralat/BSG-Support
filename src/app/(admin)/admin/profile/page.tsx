import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  // Fetch full user details from database
  // Try admin_users first, then users table (matches auth flow)
  const userId = parseInt(session.user.id);
  
  // Define a normalized user type
  type ProfileUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    last_login: Date | null;
    created_at: Date | null;
  };

  let user: ProfileUser | null = null;

  const adminUser = await prisma.admin_users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      last_login: true,
      created_at: true,
    },
  });

  if (adminUser) {
    user = {
      id: Number(adminUser.id),
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      status: adminUser.status,
      last_login: adminUser.last_login,
      created_at: adminUser.created_at,
    };
  }

  // If not found in admin_users, try users table
  if (!user) {
    const regularUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        last_login: true,
        created_at: true,
      },
    });
    
    if (regularUser) {
      user = {
        id: regularUser.id,
        name: regularUser.name,
        email: regularUser.email,
        role: regularUser.role,
        status: regularUser.status || "active",
        last_login: regularUser.last_login,
        created_at: regularUser.created_at,
      };
    }
  }

  if (!user) redirect("/login");

  function formatDate(date: Date | null) {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your account settings"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-100 text-navy-600 dark:bg-navy-900">
                <User className="h-10 w-10" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="mt-2 inline-flex items-center rounded-full bg-navy-100 px-3 py-1 text-xs font-medium capitalize text-navy-800 dark:bg-navy-900 dark:text-navy-200">
                {user.role}
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium capitalize text-gray-900 dark:text-white">
                    {user.role}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Last Login</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.last_login)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <ProfileForm
              userId={Number(user.id)}
              initialName={user.name}
              initialEmail={user.email}
            />
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <PasswordForm userId={Number(user.id)} />
          </Card>
        </div>
      </div>
    </>
  );
}
