import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "__PYON_DISPLAY_NAME__",
  description: "__PYON_COPY_META_DESCRIPTION__",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-pyon-theme="__PYON_THEME__">
      <head>
        {/* __PYON_FONT_LINK__ */}
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <header className="border-b">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/" className="font-semibold">__PYON_DISPLAY_NAME__</Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/about" className="hover:text-foreground">About</Link>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
              <Link href="/signin" className="hover:text-foreground">Sign in</Link>
              <Link
                href="/signup"
                className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90"
              >
                Sign up
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t py-8 mt-16">
          <div className="container text-sm text-muted-foreground">
            <div>© {new Date().getFullYear()} __PYON_DISPLAY_NAME__</div>
            <div className="mt-1">__PYON_COPY_FOOTER_TAGLINE__</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
