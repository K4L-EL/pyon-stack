import { notFound } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/utils";

type Post = {
  id: string;
  slug: string;
  title: string;
  bodyMarkdown: string;
  publishedAt: string | null;
};

async function fetchPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Post;
  } catch {
    return null;
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();
  return (
    <article className="container py-16 max-w-3xl">
      <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to blog
      </Link>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{post.title}</h1>
      {post.publishedAt ? (
        <time className="mt-2 block text-sm text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
      ) : null}
      <div className="prose prose-invert mt-8 whitespace-pre-wrap text-foreground/90">
        {post.bodyMarkdown}
      </div>
    </article>
  );
}
