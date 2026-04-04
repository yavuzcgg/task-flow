"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AxiosError } from "axios";
import { commentsApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Trash2, MessageSquare, Send } from "lucide-react";
import { useDictionary } from "@/providers/dictionary-provider";
import type { CommentResponse, ErrorResponse } from "@/types";

interface CommentSectionProps {
  taskId: string;
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "tr";
  const dict = useDictionary();
  const user = useAuthStore((state) => state.user);
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentsApi.getByTask(taskId, { pageSize: 50 });
      setComments(response.data.items);
    } catch {
      // Sessizce devam et
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      await commentsApi.create(taskId, { content: content.trim() });
      setContent("");
      fetchComments();
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || dict.comments.addError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm(dict.comments.deleteConfirm)) return;

    try {
      await commentsApi.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success(dict.comments.deleteSuccess);
    } catch {
      toast.error(dict.comments.deleteError);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          {dict.comments.title} ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={dict.comments.placeholder}
          rows={2}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={submitting || !content.trim()}
          className="shrink-0 self-end"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <Separator />

      {/* Comments List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          {dict.comments.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="group rounded-lg border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-sm whitespace-pre-wrap">
                  {comment.content}
                </p>
                {comment.authorId === user?.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
