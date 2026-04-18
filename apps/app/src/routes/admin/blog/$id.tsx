import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type Post } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

function EditPostPage() {
  const { me, loading } = useAuth();
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!me?.isAdmin) return;
    void api<Post>(`/api/admin/posts/${id}`).then(setPost).catch((ex) => setErr((ex as Error).message));
  }, [id, me?.isAdmin]);

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;
  if (!me.isAdmin) return <Navigate to="/dashboard" />;
  if (!post) return <div className="container py-12">{err ?? "Loading…"}</div>;

  async function save(publish?: boolean) {
    if (!post) return;
    setBusy(true);
    setErr(null);
    try {
      const updated = await api<Post>(`/api/admin/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          bodyMarkdown: post.bodyMarkdown,
          publish: publish ?? post.publishedAt !== null,
        }),
      });
      setPost(updated);
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function del() {
    if (!post) return;
    if (!confirm("Delete this post?")) return;
    await api<void>(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    navigate({ to: "/admin/blog" });
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>
            Edit · {post.publishedAt ? "published" : "draft"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
          <Input value={post.slug} onChange={(e) => setPost({ ...post, slug: e.target.value })} />
          <Input value={post.excerpt} onChange={(e) => setPost({ ...post, excerpt: e.target.value })} />
          <Textarea
            className="min-h-[20rem] font-mono text-sm"
            value={post.bodyMarkdown}
            onChange={(e) => setPost({ ...post, bodyMarkdown: e.target.value })}
          />
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <div className="flex gap-2">
            <Button disabled={busy} onClick={() => save()}>
              {busy ? "Saving…" : "Save"}
            </Button>
            {post.publishedAt ? (
              <Button variant="outline" disabled={busy} onClick={() => save(false)}>
                Unpublish
              </Button>
            ) : (
              <Button variant="outline" disabled={busy} onClick={() => save(true)}>
                Publish
              </Button>
            )}
            <Button variant="destructive" disabled={busy} onClick={del}>Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/admin/blog/$id")({ component: EditPostPage });
