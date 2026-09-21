import { ApiError, request } from "~/utils/http";

export type AuditListFilters = {
  from?: string;
  to?: string;
  caseId?: string;
  action?: string;
  outcome?: string;
  take?: number;
};

export type AuditEventItem = {
  eventId: string;
  occurredAt: string;
  action: string;
  outcome: string;
  actorType: string;
  brokerId: string | null;
  resourceType: string;
  resourceId: string;
  caseId: string | null;
  sensitivity: string | null;
  correlationId: string | null;
  dataJson: string | null;
  recordHash: string;
};

export type ListAuditEventsResult = {
  items: AuditEventItem[];
};

const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function auditUrl(): string {
  return useRuntimeConfig().public.auditApiUrl as string;
}

export function compactAuditFilters(
  filters: AuditListFilters,
): AuditListFilters {
  return {
    ...(filters.from ? { from: filters.from } : {}),
    ...(filters.to ? { to: filters.to } : {}),
    ...(filters.caseId ? { caseId: filters.caseId } : {}),
    ...(filters.action ? { action: filters.action } : {}),
    ...(filters.outcome ? { outcome: filters.outcome } : {}),
    ...(filters.take != null ? { take: filters.take } : {}),
  };
}

export function isAuditCaseId(value: string): boolean {
  return GUID.test(value);
}

export function listAuditEvents(
  filters: AuditListFilters = {},
): Promise<ListAuditEventsResult> {
  const compact = compactAuditFilters(filters);
  if (compact.caseId && !isAuditCaseId(compact.caseId)) {
    throw new ApiError(400, "Invalid case id");
  }

  const query = new URLSearchParams();
  if (compact.from) query.set("from", compact.from);
  if (compact.to) query.set("to", compact.to);
  if (compact.caseId) query.set("caseId", compact.caseId);
  if (compact.action) query.set("action", compact.action);
  if (compact.outcome) query.set("outcome", compact.outcome);
  if (compact.take != null) query.set("take", String(compact.take));

  const encoded = query.toString();
  const suffix = encoded ? `?${encoded}` : "";
  return request<ListAuditEventsResult>(auditUrl(), `/audit${suffix}`, {
    method: "GET",
  });
}
