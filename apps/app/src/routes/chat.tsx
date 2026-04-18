import { useEffect, useRef, useState } from "react";
import { createFileRoute, Navigate } from "@tanstack/react-router";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant" | "system";
type ChatMessage = { role: ChatRole; content: string };

type ChatResponse = {
  role: "assistant";
  content: string;
  usage: { promptTokens: number; completionTokens: number; totalTokens: number } | null;
};

function ChatPage() {
  const { me, loading } = useAuth();
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! Ask me anything about __PYON_DISPLAY_NAME__." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api<{ configured: boolean }>("/api/ai/status", { auth: false })
      .then((r) => setConfigured(r.configured))
      .catch(() => setConfigured(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (loading) return null;
  if (!me) return <Navigate to="/login" />;

  const send = async () => {
    const content = input.trim();
    if (!content || busy) return;
    setError(null);
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await api<ChatResponse>("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          temperature: 0.4,
        }),
      });
      setMessages((m) => [...m, { role: "assistant", content: res.content }]);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Request failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <div className="container py-12 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Chat</h1>
        <p className="mt-2 text-muted-foreground">
          Powered by Azure OpenAI. Configure <code className="text-foreground">AzureOpenAi__*</code> on the API to enable.
        </p>
      </div>

      {configured === false ? (
        <Card>
          <CardHeader>
            <CardTitle>AI is not configured</CardTitle>
            <CardDescription>
              Set <code>AzureOpenAi__Endpoint</code>, <code>AzureOpenAi__ApiKey</code>, and
              <code> AzureOpenAi__Deployment</code> on the API (or <code>OpenAi__ApiKey</code> +{" "}
              <code>OpenAi__Model</code> for plain OpenAI) and restart.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <Card className="flex flex-col h-[560px]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              )}
            >
              {m.content}
            </div>
          ))}
          {busy ? (
            <div className="text-xs text-muted-foreground">Thinking…</div>
          ) : null}
        </div>
        {error ? (
          <div className="px-4 py-2 text-sm text-destructive border-t">{error}</div>
        ) : null}
        <CardContent className="border-t p-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder="Type a message…  (Enter to send, Shift+Enter for newline)"
              disabled={configured === false || busy}
            />
            <Button onClick={send} disabled={configured === false || busy || !input.trim()}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const Route = createFileRoute("/chat")({ component: ChatPage });
