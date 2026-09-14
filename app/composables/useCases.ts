export function useCaseList() {
  const { user } = useAuth();

  return useAsyncData(
    "cases-list",
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
    () => `case-${id.value}`,
    () => getCase(id.value),
    { watch: [user] },
  );
}

export function isIgnorableAuthError(error: unknown) {
  return toApiError(error)?.status === 401;
}
