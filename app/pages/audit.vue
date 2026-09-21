<script setup lang="ts">
import { useAuditEvents } from "~/composables/useAuditEvents";
import { AUDIT_ACTION_LABELS } from "~/utils/auditLabels";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const { canReadAudit, ready } = useAuth();

watch(
  [canReadAudit, ready],
  () => {
    if (!ready.value) return;
    if (!canReadAudit.value) {
      void navigateTo("/cases", { replace: true });
    }
  },
  { immediate: true },
);

function queryString(raw: unknown): string {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : "";
}

function isoToDatetimeLocal(iso: string | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function datetimeLocalToIso(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

const filters = computed(() => ({
  caseId: queryString(route.query.caseId) || undefined,
  action: queryString(route.query.action) || undefined,
  outcome: queryString(route.query.outcome) || undefined,
  from: queryString(route.query.from) || undefined,
  to: queryString(route.query.to) || undefined,
  take: 50,
}));

const { data, pending, error, refresh } = await useAuditEvents(filters);

const forbidden = computed(() => toApiError(error.value)?.status === 403);
const loadError = computed(() => {
  if (!error.value || forbidden.value || isIgnorableAuthError(error.value)) {
    return null;
  }
  if (toApiError(error.value)?.status === 400) {
    return "Case id must be a GUID.";
  }
  return "Could not load audit events. Is Audit reachable?";
});

function onApply(event: Event) {
  const form = event.target as HTMLFormElement;
  const body = new FormData(form);
  const query: Record<string, string> = {};
  const caseId = String(body.get("caseId") ?? "").trim();
  const action = String(body.get("action") ?? "").trim();
  const outcome = String(body.get("outcome") ?? "").trim();
  const from = datetimeLocalToIso(String(body.get("from") ?? ""));
  const to = datetimeLocalToIso(String(body.get("to") ?? ""));
  if (caseId) query.caseId = caseId;
  if (action) query.action = action;
  if (outcome) query.outcome = outcome;
  if (from) query.from = from;
  if (to) query.to = to;
  void navigateTo({ path: "/audit", query }, { replace: true });
}
</script>

<template>
  <template v-if="canReadAudit">
    <h1>Audit</h1>
    <p class="lead">Tenant access and change log. Newest first.</p>

    <form :key="route.fullPath" class="form" @submit.prevent="onApply">
      <label>
        Case id
        <input name="caseId" type="text" :value="filters.caseId ?? ''" />
      </label>
      <label>
        Action
        <select name="action" :value="filters.action ?? ''">
          <option value="">All actions</option>
          <option
            v-for="(label, value) in AUDIT_ACTION_LABELS"
            :key="value"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </label>
      <label>
        Outcome
        <select name="outcome" :value="filters.outcome ?? ''">
          <option value="">All outcomes</option>
          <option value="allow">Allowed</option>
          <option value="deny">Denied</option>
        </select>
      </label>
      <label>
        From
        <input
          name="from"
          type="datetime-local"
          :value="isoToDatetimeLocal(filters.from)"
        />
      </label>
      <label>
        To
        <input
          name="to"
          type="datetime-local"
          :value="isoToDatetimeLocal(filters.to)"
        />
      </label>
      <AppButton type="submit">Apply filters</AppButton>
    </form>

    <div class="results">
      <p v-if="pending">Loading…</p>
      <p v-else-if="forbidden">
        You do not have permission to read audit events.
        <AppButton variant="secondary" type="button" @click="() => refresh()">
          Retry
        </AppButton>
      </p>
      <p v-else-if="loadError">
        {{ loadError }}
        <AppButton variant="secondary" type="button" @click="() => refresh()">
          Retry
        </AppButton>
      </p>
      <AuditTimeline v-else :items="data?.items ?? []" />
    </div>
  </template>
</template>

<style scoped>
.lead {
  margin: 0 0 1.5rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
select,
input {
  font: inherit;
  padding: 0.75rem 1rem;
  color: inherit;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
}
.results {
  margin-top: 2rem;
}
</style>
