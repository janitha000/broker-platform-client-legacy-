import {
  compactAuditFilters,
  listAuditEvents,
  type AuditEventItem,
  type AuditListFilters,
} from "~/utils/audit";

export const auditKeys = {
  list: (tenantId: string | undefined, filters: AuditListFilters) =>
    `audit-list:${tenantId ?? "anon"}:${JSON.stringify(compactAuditFilters(filters))}`,
} as const;

export function useAuditEvents(
  filters: MaybeRefOrGetter<AuditListFilters> = {},
) {
  const { user, canReadAudit } = useAuth();
  const compact = computed(() => compactAuditFilters(toValue(filters)));

  return useAsyncData(
    () => auditKeys.list(user.value?.tenantId, compact.value),
    async () => {
      if (!canReadAudit.value) {
        return { items: [] as AuditEventItem[] };
      }
      return listAuditEvents(compact.value);
    },
    {
      watch: [user, compact, canReadAudit],
      default: () => ({ items: [] }),
    },
  );
}
