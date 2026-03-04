import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Try users table first (primary auth table)
        const user = await prisma.users.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email },
            ],
          },
        });

        if (!user) {
          // Fallback to admin_users table
          const adminUser = await prisma.admin_users.findUnique({
            where: { email: credentials.email },
          });

          if (!adminUser) {
            throw new Error("Invalid credentials");
          }

          // Check admin_users lockout
          if (
            adminUser.login_attempts >= 5 &&
            adminUser.last_attempt_time &&
            Date.now() - adminUser.last_attempt_time.getTime() < 15 * 60 * 1000
          ) {
            throw new Error("Account locked. Try again in 15 minutes.");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            adminUser.password
          );

          if (!isValid) {
            await prisma.admin_users.update({
              where: { id: adminUser.id },
              data: {
                login_attempts: adminUser.login_attempts + 1,
                last_attempt_time: new Date(),
              },
            });
            throw new Error("Invalid credentials");
          }

          // Reset attempts on success
          await prisma.admin_users.update({
            where: { id: adminUser.id },
            data: {
              login_attempts: 0,
              last_login: new Date(),
            },
          });

          return {
            id: String(adminUser.id),
            name: adminUser.name,
            email: adminUser.email,
            role: adminUser.role,
          };
        }

        // Check users table lockout
        if (
          user.login_attempts >= 5 &&
          user.last_attempt_time &&
          Date.now() - user.last_attempt_time.getTime() < 15 * 60 * 1000
        ) {
          throw new Error("Account locked. Try again in 15 minutes.");
        }

        // Check status
        if (user.status !== "active") {
          throw new Error("Account is not active");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          await prisma.users.update({
            where: { id: user.id },
            data: {
              login_attempts: user.login_attempts + 1,
              last_attempt_time: new Date(),
            },
          });
          throw new Error("Invalid credentials");
        }

        // Reset attempts and update last login
        await prisma.users.update({
          where: { id: user.id },
          data: {
            login_attempts: 0,
            last_login: new Date(),
          },
        });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours default
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
