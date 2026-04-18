import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type Post } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

function AdminBlogList() {
  const { me, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!me?.isAdmin) return;
    void api<Post[]>("/api/admin/posts")
      .then(setPosts)
      .catch((ex) => setErr((ex as Error).message));
  }, [me?.isAdmin]);

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;
  if (!me.isAdmin) return <Navigate to="/dashboard" />;

  return (
    <div className="container py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Blog posts</h1>
        <Link to="/admin/blog/new" className={buttonVariants()}>New post</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All posts</CardTitle>
        </CardHeader>
        <CardContent>
          {err ? <p className="text-destructive text-sm">{err}</p> : null}
          <div className="divide-y">
            {posts.map((p) => (
              <Link
                key={p.id}
                to="/admin/blog/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between py-3 hover:bg-accent/40 -mx-2 px-2 rounded"
              >
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground">/{p.slug}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.publishedAt ? "published" : "draft"} ·{" "}
                  {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
            {posts.length === 0 && !err ? (
              <p className="text-sm text-muted-foreground py-4">No posts yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/admin/blog/")({ component: AdminBlogList });
