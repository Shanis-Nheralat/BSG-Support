import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../BlogPostForm";

export const metadata = { title: "New Blog Post" };

export default async function NewBlogPostPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const categories = await prisma.blog_categories.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Create New Post"
        description="Write a new blog article"
      />
      <BlogPostForm categories={categories} />
    </>
  );
}
