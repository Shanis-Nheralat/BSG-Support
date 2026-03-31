'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Send, Loader2, User } from 'lucide-react';

interface Comment {
  id: number;
  author_name: string;
  content: string;
  parent_id: number | null;
  created_at: string;
}

interface BlogCommentsProps {
  slug: string;
  commentCount: number;
}

export default function BlogComments({ slug, commentCount }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ author_name: '', author_email: '', content: '' });
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/blog/${slug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch {
      // Silently fail - comments are non-critical
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_name: formData.author_name,
          author_email: formData.author_email,
          content: formData.content,
          parent_id: replyTo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit comment');
      }

      setSubmitStatus({ type: 'success', message: data.message });
      setFormData({ author_name: '', author_email: '', content: '' });
      setReplyTo(null);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to submit comment.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  // Separate top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  function getReplies(commentId: number) {
    return replies.filter((r) => r.parent_id === commentId);
  }

  return (
    <section className="border-t border-gray-200 py-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-8">
        <h2 className="mb-8 flex items-center gap-2 font-poppins text-2xl font-bold text-gray-900">
          <MessageSquare className="h-6 w-6 text-navy" />
          Comments {commentCount > 0 && <span className="text-base font-normal text-gray-500">({commentCount})</span>}
        </h2>

        {/* Comment List */}
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading comments...
          </div>
        ) : topLevelComments.length === 0 ? (
          <p className="mb-8 text-sm text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="mb-10 space-y-6">
            {topLevelComments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 text-navy">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{comment.author_name}</p>
                    <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                <button
                  type="button"
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                  className="mt-3 text-xs font-medium text-navy hover:underline"
                >
                  {replyTo === comment.id ? 'Cancel Reply' : 'Reply'}
                </button>

                {/* Nested Replies */}
                {getReplies(comment.id).map((reply) => (
                  <div key={reply.id} className="mt-4 ml-8 rounded-lg border-l-2 border-navy/20 bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy/10 text-navy">
                        <User className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{reply.author_name}</p>
                        <p className="text-xs text-gray-400">{formatDate(reply.created_at)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Comment Form */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 font-poppins text-lg font-semibold text-navy">
            {replyTo ? 'Write a Reply' : 'Leave a Comment'}
          </h3>

          {submitStatus && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          {submitStatus?.type !== 'success' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.author_name}
                    onChange={(e) => setFormData((p) => ({ ...p, author_name: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.author_email}
                    onChange={(e) => setFormData((p) => ({ ...p, author_email: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                    placeholder="your@email.com"
                  />
                  <p className="mt-1 text-xs text-gray-400">Your email will not be published.</p>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Comment *</label>
                <textarea
                  required
                  rows={4}
                  maxLength={2000}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-navy focus:ring-1 focus:ring-navy"
                  placeholder="Share your thoughts..."
                />
                <p className="mt-1 text-xs text-gray-400">{formData.content.length}/2000 characters</p>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    {replyTo ? 'Post Reply' : 'Post Comment'}
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400">All comments are reviewed before being published.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
