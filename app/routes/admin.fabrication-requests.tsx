import type { Route } from "./+types/admin.fabrication-requests";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Mail,
  Phone,
  RefreshCw,
  Wrench,
} from "lucide-react";
import {
  getAdminFabricationRequests,
  updateFabricationStatus,
} from "~/lib/api/endpoints";
import { formatMoney, formatDateTime } from "~/lib/format";
import { site } from "~/lib/site";
import { Card } from "~/components/ui/Card";
import { Badge } from "~/components/ui/Badge";
import { Button } from "~/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/Table";
import type { FabricationRequestRow, FabricationStatus } from "~/types/api";

export function meta() {
  return [{ title: `Fabrication Requests — ${site.name} Admin` }];
}

export default function AdminFabricationPage() {
  const [requests, setRequests] = useState<FabricationRequestRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [quoteInputs, setQuoteInputs] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRequests = async (status = statusFilter) => {
    setIsLoading(true);
    try {
      const res = await getAdminFabricationRequests(status || undefined);
      setRequests(res.items || []);
      const quotes: Record<string, string> = {};
      res.items?.forEach((r) => {
        if (r.estimatedQuote != null) quotes[r.id] = String(r.estimatedQuote);
      });
      setQuoteInputs(quotes);
    } catch {
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests(statusFilter);
  }, [statusFilter]);

  const handleUpdate = async (
    id: string,
    newStatus: FabricationStatus,
    quoteVal?: string
  ) => {
    setUpdatingId(id);
    setSuccessMessage(null);
    setErrorMessage(null);

    const quoteNum = quoteVal ? parseInt(quoteVal, 10) : undefined;

    try {
      const res = await updateFabricationStatus(id, {
        status: newStatus,
        estimatedQuote: quoteNum,
      });

      setRequests((prev) => prev.map((r) => (r.id === id ? res.item : r)));
      setSuccessMessage(`Inquiry for ${res.item.fullName} updated to "${newStatus}".`);
    } catch {
      setErrorMessage("Failed to update fabrication status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-1">Engineering Queue</p>
          <h1 className="text-2xl sm:text-3xl font-black text-fg">Fabrication Requests</h1>
          <p className="text-xs text-muted mt-1">
            Custom roofing, on-site roll forming inquiries, and contractor quotes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequests(statusFilter)}
          disabled={isLoading}
          className="btn-press p-2 rounded-lg bg-raised text-muted hover:text-fg border border-line self-start sm:self-auto"
          title="Refresh requests"
        >
          <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="size-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-bold flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {[
          { id: "", label: "All Inquiries" },
          { id: "new", label: "New Inquiries" },
          { id: "contacted", label: "Contacted" },
          { id: "quoted", label: "Quoted" },
          { id: "won", label: "Won / Commissioned" },
          { id: "lost", label: "Closed / Lost" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`btn-press rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? "bg-accent text-on-accent"
                : "border border-line bg-raised text-muted hover:text-fg"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-sm text-muted">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading fabrication inquiries...
        </div>
      ) : requests.length === 0 ? (
        <Card className="p-12 text-center bg-raised border border-line rounded-2xl">
          <Wrench className="size-10 text-muted mx-auto mb-2" />
          <p className="font-bold text-fg">No fabrication requests</p>
          <p className="text-xs text-muted mt-1">
            {statusFilter
              ? `No inquiries currently marked as "${statusFilter}".`
              : "No custom fabrication inquiries logged."}
          </p>
        </Card>
      ) : (
        <Card className="bg-raised border border-line rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client / Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Budget / Quote</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => {
                const isExpanded = expandedId === req.id;

                return (
                  <React.Fragment key={req.id}>
                    <TableRow className={isExpanded ? "bg-page" : ""}>
                      <TableCell>
                        <div className="font-bold text-fg text-sm">{req.fullName}</div>
                        <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                          <span>{req.phone}</span>
                          <span>•</span>
                          <span className="capitalize">{req.preferredContact}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge tone="accent">{req.serviceType.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted">
                        {req.city}, {req.state}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-fg">
                          {req.estimatedQuote != null
                            ? formatMoney(req.estimatedQuote)
                            : req.budget
                            ? `${formatMoney(req.budget)} (Target)`
                            : "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <select
                          value={req.status}
                          disabled={updatingId === req.id}
                          onChange={(e) =>
                            handleUpdate(
                              req.id,
                              e.target.value as FabricationStatus,
                              quoteInputs[req.id]
                            )
                          }
                          className="rounded border border-line bg-page text-xs font-bold px-2 py-1 focus:border-accent"
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="quoted">quoted</option>
                          <option value="won">won</option>
                          <option value="lost">lost</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-xs text-muted">
                        {formatDateTime(req.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : req.id)}
                          className="btn-press p-1.5 text-xs text-muted hover:text-fg"
                          title={isExpanded ? "Collapse" : "View specifications"}
                        >
                          {isExpanded ? (
                            <ChevronUp className="size-4" />
                          ) : (
                            <ChevronDown className="size-4" />
                          )}
                        </button>
                      </TableCell>
                    </TableRow>

                    {isExpanded && (
                      <TableRow className="bg-page">
                        <TableCell colSpan={7} className="p-5 border-t border-line/60">
                          <div className="space-y-4 text-xs">
                            <div>
                              <span className="font-bold uppercase text-muted tracking-wider block mb-1">
                                Work Description:
                              </span>
                              <p className="text-fg bg-raised p-3 rounded-lg border border-line leading-relaxed whitespace-pre-wrap">
                                {req.description}
                              </p>
                            </div>

                            {req.measurements && (
                              <div>
                                <span className="font-bold uppercase text-muted tracking-wider block mb-1">
                                  Provided Measurements:
                                </span>
                                <p className="font-mono text-fg bg-raised p-2 rounded-lg border border-line">
                                  {req.measurements}
                                </p>
                              </div>
                            )}

                            <div className="pt-2 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-muted">Client Email:</span>
                                <a
                                  href={`mailto:${req.email}`}
                                  className="font-bold text-accent hover:underline font-mono"
                                >
                                  {req.email}
                                </a>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-muted">Set Estimated Quote (₦):</span>
                                <input
                                  type="number"
                                  placeholder="e.g. 1800000"
                                  value={quoteInputs[req.id] || ""}
                                  onChange={(e) =>
                                    setQuoteInputs((prev) => ({
                                      ...prev,
                                      [req.id]: e.target.value,
                                    }))
                                  }
                                  className="w-32 rounded border border-line bg-raised py-1 px-2 text-xs font-bold focus:border-accent"
                                />
                                <Button
                                  variant="primary"
                                  size="sm"
                                  disabled={updatingId === req.id}
                                  onClick={() =>
                                    handleUpdate(req.id, req.status, quoteInputs[req.id])
                                  }
                                >
                                  Update Quote
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}