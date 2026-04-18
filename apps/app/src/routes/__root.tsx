import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

function Shell() {
  const { me, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold">__PYON_DISPLAY_NAME__</Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            {me ? (
              <>
                <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
                <Link to="/chat" className="hover:text-foreground">Chat</Link>
                <Link to="/settings" className="hover:text-foreground">Settings</Link>
                {me.isAdmin ? <Link to="/admin" className="hover:text-foreground">Admin</Link> : null}
                <span className="text-foreground">{me.displayName}</span>
                <Button size="sm" variant="outline" onClick={signOut}>Sign out</Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-foreground">Log in</Link>
                <Link to="/signup" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}

export const Route = createRootRoute({ component: Shell });
