<script setup lang="ts">
import type { AuditEventItem } from "~/utils/audit";
import {
  auditActionLabel,
  auditActorLabel,
  auditOutcomeLabel,
} from "~/utils/auditLabels";

withDefaults(
  defineProps<{
    items: AuditEventItem[];
    showCaseLink?: boolean;
  }>(),
  { showCaseLink: true },
);
</script>

<template>
  <p v-if="items.length === 0" class="empty">
    No audit events for this filter.
  </p>
  <ol v-else class="list">
    <li
      v-for="item in items"
      :key="item.eventId"
      :class="item.outcome === 'deny' ? 'deny' : 'item'"
    >
      <p class="when">{{ formatDateTime(item.occurredAt) }}</p>
      <p class="action">{{ auditActionLabel(item.action) }}</p>
      <p class="meta">
        <span>{{ auditOutcomeLabel(item.outcome) }}</span>
        <span>{{ auditActorLabel(item.actorType, item.brokerId) }}</span>
        <NuxtLink
          v-if="showCaseLink && item.caseId"
          :to="`/cases/${item.caseId}`"
        >
          Case
        </NuxtLink>
      </p>
      <details v-if="item.dataJson" class="details">
        <summary>Details</summary>
        <pre>{{ item.dataJson }}</pre>
      </details>
    </li>
  </ol>
</template>

<style scoped>
.empty {
  margin: 0;
  color: var(--color-muted);
}

.list {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.item,
.deny {
  display: grid;
  gap: var(--space-1);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.deny {
  border-color: var(--color-danger);
  background: var(--color-danger-bg);
}

.when,
.meta {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.action {
  margin: 0;
  font-weight: 600;
  color: var(--color-heading);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.details {
  margin-top: var(--space-2);
  font-size: 0.875rem;
}

.details pre {
  margin: var(--space-2) 0 0;
  overflow: auto;
  font-family: ui-monospace, Consolas, monospace;
  white-space: pre-wrap;
}
</style>
