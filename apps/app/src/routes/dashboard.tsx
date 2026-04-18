import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

function DashboardPage() {
  const { me, loading } = useAuth();
  if (loading) return null;
  if (!me) return <Navigate to="/login" />;

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome, {me.displayName}</h1>
        <p className="mt-2 text-muted-foreground">
          You are signed in as {me.email}. This is your __PYON_DISPLAY_NAME__ dashboard.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>Build your first feature.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Open <code className="text-foreground">apps/app/src/routes</code> and add a new route.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>API</CardTitle>
            <CardDescription>ASP.NET Core + EF + Postgres.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add a controller in <code className="text-foreground">apps/api/Pyon.Api/Controllers</code>.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
            <CardDescription>Manage users &amp; content.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {me.isAdmin ? "You have admin access." : "Ask an admin for access."}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });
