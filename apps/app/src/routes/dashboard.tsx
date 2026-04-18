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
        <h1 className="text-3xl font-semibold tracking-tight">__PYON_COPY_DASHBOARD_WELCOME__, {me.displayName}</h1>
        <p className="mt-2 text-muted-foreground">
          You are signed in as {me.email}. __PYON_COPY_DASHBOARD_SUB__
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>__PYON_COPY_DASHBOARD_CARD_1_TITLE__</CardTitle>
            <CardDescription>__PYON_COPY_DASHBOARD_CARD_1_DESC__</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            __PYON_COPY_DASHBOARD_CARD_1_BODY__
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>__PYON_COPY_DASHBOARD_CARD_2_TITLE__</CardTitle>
            <CardDescription>__PYON_COPY_DASHBOARD_CARD_2_DESC__</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            __PYON_COPY_DASHBOARD_CARD_2_BODY__
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>__PYON_COPY_DASHBOARD_CARD_3_TITLE__</CardTitle>
            <CardDescription>__PYON_COPY_DASHBOARD_CARD_3_DESC__</CardDescription>
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
