"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import Card from "@/components/ui/Card";
import { Save, ArrowLeft, X, Image as ImageIcon, Plus, Check, Languages, Loader2 } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface PostData {
  id?: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_path: string | null;
  featured: boolean;
  status: string;
  category_id: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

interface TranslationData {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  auto_translated: boolean;
}

interface BlogPostFormProps {
  post?: PostData;
  categories: Category[];
  existingTranslation?: TranslationData;
}

export function BlogPostForm({ post, categories: initialCategories, existingTranslation }: BlogPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [imagePath, setImagePath] = useState(post?.image_path || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  // German translation state
  const [deTitle, setDeTitle] = useState(existingTranslation?.title || "");
  const [deSlug, setDeSlug] = useState(existingTranslation?.slug || "");
  const [deExcerpt, setDeExcerpt] = useState(existingTranslation?.excerpt || "");
  const [deContent, setDeContent] = useState(existingTranslation?.content || "");
  const [deMetaTitle, setDeMetaTitle] = useState(existingTranslation?.meta_title || "");
  const [deMetaDescription, setDeMetaDescription] = useState(existingTranslation?.meta_description || "");
  const [deAutoTranslated, setDeAutoTranslated] = useState(existingTranslation?.auto_translated ?? true);
  
  // Category state
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(post?.category_id?.toString() || "");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const isEditing = !!post?.id;
  const slugRef = useRef<HTMLInputElement>(null);

  async function handleCreateCategory() {
    if (!newCategoryName.trim()) return;

    setIsCreatingCategory(true);
    setError("");

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create category");
      }

      // Add new category to list and select it
      setCategories([...categories, result.category]);
      setSelectedCategoryId(result.category.id.toString());
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "blog");

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to upload image");
      }

      setImagePath(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function removeImage() {
    setImagePath("");
  }

  async function handleAutoTranslate() {
    setIsTranslating(true);
    setError("");

    // Gather current EN field values from the form
    const form = document.querySelector("form") as HTMLFormElement | null;
    if (!form) return;

    const fd = new FormData(form);
    const fields: Record<string, string> = {};
    const title = fd.get("title") as string;
    if (title) fields.title = title;
    const excerpt = fd.get("excerpt") as string;
    if (excerpt) fields.excerpt = excerpt;
    const content = fd.get("content") as string;
    if (content) fields.content = content;
    const metaTitle = fd.get("meta_title") as string;
    if (metaTitle) fields.meta_title = metaTitle;
    const metaDesc = fd.get("meta_description") as string;
    if (metaDesc) fields.meta_description = metaDesc;

    if (Object.keys(fields).length === 0) {
      setError("Fill in the English fields first before translating.");
      setIsTranslating(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, targetLang: "DE" }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Translation failed");
      }

      const { translated } = await res.json();
      if (translated.title) setDeTitle(translated.title);
      if (translated.slug) setDeSlug(translated.slug);
      if (translated.excerpt) setDeExcerpt(translated.excerpt);
      if (translated.content) setDeContent(translated.content);
      if (translated.meta_title) setDeMetaTitle(translated.meta_title);
      if (translated.meta_description) setDeMetaDescription(translated.meta_description);
      setDeAutoTranslated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setIsTranslating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      excerpt: formData.get("excerpt") as string || null,
      content: formData.get("content") as string,
      image_path: imagePath || null,
      featured: formData.get("featured") === "on",
      status: formData.get("status") as string,
      category_id: selectedCategoryId ? parseInt(selectedCategoryId) : null,
      meta_title: formData.get("meta_title") as string || null,
      meta_description: formData.get("meta_description") as string || null,
      meta_keywords: formData.get("meta_keywords") as string || null,
    };

    // Include German translation if any DE field is filled
    if (deTitle && deSlug && deContent) {
      data.translations = [
        {
          locale: "de",
          title: deTitle,
          slug: deSlug,
          excerpt: deExcerpt || null,
          content: deContent,
          meta_title: deMetaTitle || null,
          meta_description: deMetaDescription || null,
          auto_translated: deAutoTranslated,
        },
      ];
    }

    try {
      const url = isEditing ? `/api/admin/blog/${post.id}` : "/api/admin/blog";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to save post");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Post Content
            </h3>
            <div className="space-y-4">
              <Input
                label="Title"
                name="title"
                required
                defaultValue={post?.title || ""}
                onChange={(e) => {
                  if (!isEditing && slugRef.current) {
                    slugRef.current.value = generateSlug(e.target.value);
                  }
                }}
              />
              <Input
                ref={slugRef}
                label="Slug"
                name="slug"
                required
                defaultValue={post?.slug || ""}
                hint="URL-friendly version of the title"
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  rows={3}
                  defaultValue={post?.excerpt || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Brief summary of the post..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content *
                </label>
                <textarea
                  name="content"
                  rows={15}
                  required
                  defaultValue={post?.content || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Write your post content here... (HTML supported)"
                />
              </div>
            </div>
          </Card>

          {/* SEO Settings */}
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                name="meta_title"
                defaultValue={post?.meta_title || ""}
                hint="Leave empty to use post title"
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  rows={2}
                  defaultValue={post?.meta_description || ""}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Brief description for search engines..."
                />
              </div>
              <Input
                label="Meta Keywords"
                name="meta_keywords"
                defaultValue={post?.meta_keywords || ""}
                hint="Comma-separated keywords"
              />
            </div>
          </Card>

          {/* German Translation */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Languages className="h-5 w-5" />
                German Translation
              </h3>
              <button
                type="button"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isTranslating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Languages className="h-3.5 w-3.5" />
                )}
                {isTranslating ? "Translating..." : "Auto-Translate"}
              </button>
            </div>
            {deAutoTranslated && deTitle && (
              <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">
                Auto-translated via DeepL. Edit fields below to refine.
              </p>
            )}
            <div className="space-y-4">
              <Input
                label="Titel (DE)"
                value={deTitle}
                onChange={(e) => {
                  setDeTitle(e.target.value);
                  setDeAutoTranslated(false);
                }}
                placeholder="German title"
              />
              <Input
                label="Slug (DE)"
                value={deSlug}
                onChange={(e) => {
                  setDeSlug(e.target.value);
                  setDeAutoTranslated(false);
                }}
                placeholder="german-url-slug"
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Auszug (DE)
                </label>
                <textarea
                  rows={3}
                  value={deExcerpt}
                  onChange={(e) => {
                    setDeExcerpt(e.target.value);
                    setDeAutoTranslated(false);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="German excerpt..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inhalt (DE)
                </label>
                <textarea
                  rows={10}
                  value={deContent}
                  onChange={(e) => {
                    setDeContent(e.target.value);
                    setDeAutoTranslated(false);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="German content (HTML supported)..."
                />
              </div>
              <Input
                label="Meta-Titel (DE)"
                value={deMetaTitle}
                onChange={(e) => {
                  setDeMetaTitle(e.target.value);
                  setDeAutoTranslated(false);
                }}
                placeholder="German meta title"
              />
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Meta-Beschreibung (DE)
                </label>
                <textarea
                  rows={2}
                  value={deMetaDescription}
                  onChange={(e) => {
                    setDeMetaDescription(e.target.value);
                    setDeAutoTranslated(false);
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="German meta description..."
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Publish
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue={post?.status || "draft"}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                {showNewCategory ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Enter category name"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCreateCategory();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={isCreatingCategory || !newCategoryName.trim()}
                        className="rounded-lg bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                        title="Create category"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewCategory(false);
                          setNewCategoryName("");
                        }}
                        className="rounded-lg bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {isCreatingCategory && (
                      <p className="text-xs text-gray-500">Creating...</p>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-navy-500 focus:outline-none focus:ring-1 focus:ring-navy-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="">No Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="rounded-lg bg-navy-600 px-3 py-2 text-white hover:bg-navy-700"
                      title="Add new category"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  defaultChecked={post?.featured || false}
                  className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-500"
                />
                <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                  Featured post
                </label>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href="/admin/blog" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Featured Image
            </h3>
            
            {/* Image Preview */}
            {imagePath ? (
              <div className="relative mb-4">
                <img
                  src={imagePath}
                  alt="Featured"
                  className="w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">No image selected</p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="space-y-3">
              <label className="block">
                <span className="sr-only">Choose image</span>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-navy-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-navy-700 disabled:opacity-50"
                  />
                </div>
              </label>
              {isUploading && (
                <p className="text-sm text-navy-600">Uploading...</p>
              )}
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-900">or</span>
                </div>
              </div>

              <Input
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                value={imagePath}
                onChange={(e) => setImagePath(e.target.value)}
                hint="Enter external image URL"
              />
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
