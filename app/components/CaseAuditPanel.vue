<script setup lang="ts">
import { useAuditEvents } from "~/composables/useAuditEvents";

const props = defineProps<{
  caseId: string;
}>();

const { data, pending, error, refresh } = await useAuditEvents(() => ({
  caseId: props.caseId,
  take: 50,
}));

const forbidden = computed(() => toApiError(error.value)?.status === 403);
const loadError = computed(() => {
  if (!error.value || forbidden.value || isIgnorableAuthError(error.value)) {
    return null;
  }
  return "Could not load this case’s audit events. Is Audit reachable?";
});
</script>

<template>
  <section class="section" aria-labelledby="audit-title">
    <div class="heading">
      <div>
        <h2 id="audit-title">Audit</h2>
        <p>Who opened or changed this case.</p>
      </div>
      <NuxtLink :to="`/audit?caseId=${encodeURIComponent(caseId)}`">
        Open in Audit
      </NuxtLink>
    </div>

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
    <AuditTimeline v-else :items="data?.items ?? []" :show-case-link="false" />
  </section>
</template>

<style scoped>
.section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.heading h2,
.heading p {
  margin: 0;
}

.heading p {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.heading a {
  flex-shrink: 0;
  font-size: 0.875rem;
}
</style>
