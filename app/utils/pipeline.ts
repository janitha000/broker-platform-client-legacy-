export type PipelineColumn = {
  status: CaseStatus;
  label: string;
  emptyTitle: string;
  emptyBody: string;
};

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  {
    status: "Enquiry",
    label: "Enquiry",
    emptyTitle: "No enquiries.",
    emptyBody: "Create a case from the list view.",
  },
  {
    status: "FactFindCompleted",
    label: "Fact find",
    emptyTitle: "No fact finds.",
    emptyBody: "Complete a fact-find on a case.",
  },
  {
    status: "Recommendation",
    label: "Recommendation",
    emptyTitle: "No recommendations.",
    emptyBody: "Present a recommendation after fact-find.",
  },
  {
    status: "Lodged",
    label: "Lodged",
    emptyTitle: "No lodged cases.",
    emptyBody: "Lodge an application with a lender.",
  },
  {
    status: "ConditionalApproval",
    label: "Conditional approval",
    emptyTitle: "No conditional approvals.",
    emptyBody:
      "Move a lodged case when the lender issues AIP/conditional approval.",
  },
  {
    status: "FormalApproval",
    label: "Formal approval",
    emptyTitle: "No formal approvals.",
    emptyBody:
      "Move a case when the lender issues formal (unconditional) approval.",
  },
  {
    status: "Settled",
    label: "Settled",
    emptyTitle: "No settled cases.",
    emptyBody: "Move a case when settlement has occurred.",
  },
  {
    status: "NotProceeded",
    label: "Not proceeded",
    emptyTitle: "No NPW cases.",
    emptyBody: "Move a case that was lost, declined, or withdrawn.",
  },
];
