import type { Route } from "./+types/account.sessions";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Laptop,
  LogOut,
  MonitorSmartphone,
  RefreshCw,
  Shield,
  Smartphone,
} from "lucide-react";
import { getSessions, revokeSession } from "~/lib/api/endpoints";
import { formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import type { Session } from "~/types/api";

export function meta() {
  return [{ title: `Active Sessions — ${site.name}` }];
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchSessionsList = async () => {
    setIsLoading(true);
    try {
      const res = await getSessions();
      setSessions(res.items || []);
    } catch {
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionsList();
  }, []);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    setMessage(null);
    try {
      await revokeSession(id);
      setMessage("Session successfully revoked.");
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setMessage("Failed to revoke session. Please try again.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="eyebrow mb-1">Security</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Active Sessions</h1>
          <p className="text-xs text-muted mt-1">
            Devices and browser sessions currently authenticated with your account.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchSessionsList}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line"
          title="Refresh sessions"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading active sessions...
        </div>
      ) : sessions.length === 0 ? (
        <Card className="p-8 text-center bg-raised border border-line rounded-2xl">
          <Shield className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No other active sessions</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => {
            const isMobile =
              sess.userAgent?.toLowerCase().includes("mobile") ||
              sess.userAgent?.toLowerCase().includes("android") ||
              sess.userAgent?.toLowerCase().includes("iphone");

            return (
              <Card
                key={sess.id}
                className="p-5 bg-raised border border-line rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="size-10 rounded-xl bg-page border border-line flex items-center justify-center text-accent shrink-0">
                    {isMobile ? <Smartphone className="size-5" /> : <Laptop className="size-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-fg text-sm truncate">
                        {sess.userAgent || "Web Browser"}
                      </p>
                      {sess.isCurrent && (
                        <Badge tone="accent">This Device</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-1">
                      {sess.ip && <span>IP: {sess.ip}</span>}
                      <span>Last active: {formatDateTime(sess.lastSeenAt)}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    disabled={revokingId === sess.id}
                    onClick={() => handleRevoke(sess.id)}
                    className="self-start sm:self-auto text-xs font-bold"
                  >
                    {revokingId === sess.id ? "Revoking..." : "Revoke Session"}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}