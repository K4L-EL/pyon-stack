import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      await signUp(displayName, email, password);
      navigate({ to: "/dashboard" });
    } catch (ex) {
      setErr((ex as Error).message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container py-16 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start using __PYON_DISPLAY_NAME__.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Input placeholder="Your name" required value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <Input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password (min 8 chars)" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
            {err ? <p className="text-sm text-destructive">{err}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Creating account…" : "Sign up"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account? <Link to="/login" className="underline">Log in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/signup")({ component: SignupPage });
