import Link from "next/link";
import { API_URL } from "@/lib/utils";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
};

async function fetchPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return (await res.json()) as Post[];
  } catch {
    return [];
  }
}

export default async function BlogIndex() {
  const posts = await fetchPosts();
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 text-muted-foreground">
        Latest from the __PYON_DISPLAY_NAME__ team.
      </p>
      <div className="mt-10 divide-y">
        {posts.length === 0 ? (
          <p className="py-8 text-sm text-muted-foreground">
            No posts yet. Publish your first post from the admin panel.
          </p>
        ) : (
          posts.map((p) => (
            <article key={p.id} className="py-6">
              <Link href={`/blog/${p.slug}`} className="block group">
                <h2 className="text-xl font-semibold group-hover:underline">{p.title}</h2>
                <p className="mt-2 text-muted-foreground text-sm">{p.excerpt}</p>
                {p.publishedAt ? (
                  <time className="mt-2 block text-xs text-muted-foreground">
                    {new Date(p.publishedAt).toLocaleDateString()}
                  </time>
                ) : null}
              </Link>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
