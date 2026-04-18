import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type Post } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function NewPostPage() {
  const { me, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;
  if (!me.isAdmin) return <Navigate to="/dashboard" />;

  async function save(publish: boolean) {
    setBusy(true);
    setErr(null);
    try {
      const created = await api<Post>("/api/admin/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          excerpt,
          bodyMarkdown: body,
          publish,
        }),
      });
      navigate({ to: "/admin/blog/$id", params: { id: created.id } });
    } catch (ex) {
      setErr((ex as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-12 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>New post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => {
            setTitle(e.target.value);
            if (!slug) setSlug(slugify(e.target.value));
          }} />
          <Input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Input placeholder="Excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <Textarea
            placeholder="Write your post in markdown…"
            className="min-h-[20rem] font-mono text-sm"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          {err ? <p className="text-sm text-destructive">{err}</p> : null}
          <div className="flex gap-2">
            <Button disabled={busy || !title} onClick={() => save(false)}>
              {busy ? "Saving…" : "Save draft"}
            </Button>
            <Button variant="outline" disabled={busy || !title} onClick={() => save(true)}>
              Save &amp; publish
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/admin/blog/new")({ component: NewPostPage });
