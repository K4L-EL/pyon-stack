import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useState } from "react";

function SettingsPage() {
  const { me, loading, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(me?.displayName ?? "");

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;

  return (
    <div className="container py-12 max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update how you appear across the product.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Display name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input value={me.email} disabled />
          </div>
          <Button disabled>Save (TODO)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/settings")({ component: SettingsPage });
