import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string;
};

function AdminHome() {
  const { me, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!me?.isAdmin) return;
    void api<AdminUser[]>("/api/users")
      .then(setUsers)
      .catch((ex) => setErr((ex as Error).message));
  }, [me?.isAdmin]);

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;
  if (!me.isAdmin) return <Navigate to="/dashboard" />;

  return (
    <div className="container py-12 space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-muted-foreground">Users &amp; content management.</p>
        </div>
        <Link to="/admin/blog" className="text-sm underline">Manage blog →</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>All registered accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {err ? <p className="text-destructive text-sm">{err}</p> : null}
          <div className="divide-y">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium">{u.displayName}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {u.isAdmin ? "admin" : "user"} · {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {users.length === 0 && !err ? (
              <p className="text-sm text-muted-foreground py-4">No users yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/admin/")({ component: AdminHome });
