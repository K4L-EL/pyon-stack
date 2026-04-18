import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

function IndexPage() {
  const { me, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={me ? "/dashboard" : "/login"} />;
}

export const Route = createFileRoute("/")({ component: IndexPage });
