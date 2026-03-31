import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth-helpers";
import { PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { BlogPostForm } from "../../BlogPostForm";

export const metadata = { title: "Edit Blog Post" };

interface EditBlogPostPageProps {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const postId = parseInt(params.id);
  if (isNaN(postId)) notFound();

  const [post, categories] = await Promise.all([
    prisma.blog_posts.findUnique({
      where: { id: postId },
      include: { translations: true },
    }),
    prisma.blog_categories.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!post) notFound();

  // Extract German translation if it exists
  const deTranslation = post.translations.find((t) => t.locale === "de") || null;

  return (
    <>
      <PageHeader
        title="Edit Post"
        description={`Editing: ${post.title}`}
      />
      <BlogPostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image_path: post.image_path,
          featured: post.featured,
          status: post.status,
          category_id: post.category_id,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          meta_keywords: post.meta_keywords,
        }}
        categories={categories}
        existingTranslation={deTranslation ? {
          title: deTranslation.title,
          slug: deTranslation.slug,
          excerpt: deTranslation.excerpt,
          content: deTranslation.content,
          meta_title: deTranslation.meta_title,
          meta_description: deTranslation.meta_description,
          auto_translated: deTranslation.auto_translated,
        } : undefined}
      />
    </>
  );
}
