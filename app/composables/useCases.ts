export const caseKeys = {
  list: "cases-list",
  detail: (caseId: string) => `case-${caseId}`,
} as const;

export function useCaseList() {
  const { user } = useAuth();

  return useAsyncData(
    caseKeys.list,
    async () => {
      const result = await listCases();
      return result.cases;
    },
    { watch: [user] },
  );
}

export function useCaseDetail(caseId: MaybeRefOrGetter<string>) {
  const { user } = useAuth();
  const id = computed(() => toValue(caseId));

  return useAsyncData(
    () => caseKeys.detail(id.value),
    () => getCase(id.value),
    { watch: [user] },
  );
}

export function refreshCaseList() {
  return refreshNuxtData(caseKeys.list);
}

export function refreshCaseDetail(caseId: string) {
  return refreshNuxtData(caseKeys.detail(caseId));
}

/** Drop list + every case-{id} payload. No refetch. */
export function clearCasesCache() {
  clearNuxtData(caseKeys.list);
  clearNuxtData((key) => key.startsWith("case-"));
}

export function isIgnorableAuthError(error: unknown) {
  return toApiError(error)?.status === 401;
}
