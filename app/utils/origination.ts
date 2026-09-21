/**
 * Origination API. Types from OpenAPI; cookies via request().
 */
import type { components } from "./generated/origination";

export type CaseStatus = components["schemas"]["CaseStatus"];
export type CaseSummary = components["schemas"]["CreateCaseResult"];
export type CaseListItem = components["schemas"]["CaseDto"];
export type CaseList = components["schemas"]["GetCasesResult"];
export type CaseDetail = components["schemas"]["GetCaseResult"];
export type FactFind = components["schemas"]["FactFindDto"];
/** Form body; CaseId is on the route, not the JSON. */
export type FactFindPayload = Omit<
  components["schemas"]["CompleteFactFindCommand"],
  "caseId"
>;

export const CASE_STATUSES = [
  "Enquiry",
  "FactFindCompleted",
  "Recommendation",
  "Lodged",
  "ConditionalApproval",
  "FormalApproval",
  "Settled",
  "NotProceeded",
] as const satisfies readonly CaseStatus[];

function originationUrl(): string {
  return useRuntimeConfig().public.originationApiUrl as string;
}

export function listCases(): Promise<CaseList> {
  return request<CaseList>(originationUrl(), "/cases", { method: "GET" });
}

export function createCase(inquiryNotes: string): Promise<CaseSummary> {
  return request<CaseSummary>(originationUrl(), "/cases", {
    method: "POST",
    body: { inquiryNotes },
  });
}

export function getCase(caseId: string): Promise<CaseDetail> {
  return request<CaseDetail>(originationUrl(), `/cases/${caseId}`, {
    method: "GET",
  });
}

export function completeFactFind(
  caseId: string,
  factFind: FactFindPayload,
): Promise<CaseSummary> {
  return request<CaseSummary>(originationUrl(), `/cases/${caseId}/fact-find`, {
    method: "PUT",
    body: factFind,
  });
}

export function parseCaseStatusParam(
  value: string | null,
): CaseStatus | undefined {
  return CASE_STATUSES.find((status) => status === value);
}
