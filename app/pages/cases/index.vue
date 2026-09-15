<script setup lang="ts">
const route = useRoute();
const inquiryNotes = ref("");
const creating = ref(false);
const createError = ref<string | null>(null);

const { data, pending, error, refresh } = await useCaseList();

const statusFilter = computed(() => {
  const raw = route.query.status;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return parseCaseStatusParam(typeof value === "string" ? value : null);
});

const STATUS_FILTERS: { label: string; status?: CaseStatus }[] = [
  { label: "All" },
  ...PIPELINE_COLUMNS.map((column) => ({
    label: column.label,
    status: column.status,
  })),
];

const cases = computed(() => {
  const list = data.value ?? [];
  const filter = statusFilter.value;
  return filter ? list.filter((item) => item.status === filter) : list;
});

const listError = computed(() => {
  if (!error.value || isIgnorableAuthError(error.value)) {
    return null;
  }
  return "Could not load cases. Is Origination reachable?";
});

const empty = computed(() => {
  const filter = statusFilter.value;
  if (!filter) {
    return {
      title: "No cases for this brokerage yet.",
      body: "Create a new case to get started.",
    };
  }
  const column = PIPELINE_COLUMNS.find((item) => item.status === filter);
  return {
    title: column?.emptyTitle ?? "No cases.",
    body: column
      ? `${column.emptyBody} Or choose All.`
      : "Create a new case, or choose All.",
  };
});

function setStatusFilter(next?: CaseStatus) {
  const query = { ...route.query };
  if (next) {
    query.status = next;
  } else {
    delete query.status;
  }
  void navigateTo({ path: "/cases", query }, { replace: true });
}

async function onCreate() {
  createError.value = null;
  creating.value = true;
  try {
    const created = await createCase(inquiryNotes.value);
    await refresh();
    await navigateTo(`/cases/${created.caseId}`);
  } catch (caught) {
    if (!isIgnorableAuthError(caught)) {
      createError.value = "Could not create a case. Is Origination reachable?";
    }
  } finally {
    creating.value = false;
  }
}
</script>

<template>
  <h1>
    Cases
    <span v-if="pending && data" class="updating"> Updating… </span>
  </h1>

  <form class="form" @submit.prevent="onCreate">
    <label>
      New enquiry
      <input v-model="inquiryNotes" name="inquiryNotes" type="text" />
    </label>
    <AppButton type="submit" :disabled="creating">
      {{ creating ? "Creating…" : "Create case" }}
    </AppButton>
  </form>
  <p v-if="createError" role="alert">{{ createError }}</p>

  <nav class="filters" aria-label="Filter cases">
    <button
      v-for="item in STATUS_FILTERS"
      :key="item.label"
      type="button"
      :class="item.status === statusFilter ? 'filterCurrent' : 'filter'"
      :aria-current="item.status === statusFilter ? 'true' : undefined"
      @click="setStatusFilter(item.status)"
    >
      {{ item.label }}
    </button>
  </nav>

  <div class="results">
    <p v-if="pending && !data">Loading…</p>
    <p v-else-if="listError">
      {{ listError }}
      <AppButton variant="secondary" type="button" @click="() => refresh()">
        Retry
      </AppButton>
    </p>
    <div v-else-if="cases.length === 0">
      <p>{{ empty.title }}</p>
      <p>{{ empty.body }}</p>
    </div>
    <ul v-else class="list">
      <li v-for="item in cases" :key="item.caseId">
        <NuxtLink class="item" :to="`/cases/${item.caseId}`">
          <span class="status">{{ item.status }}</span>
          <span>{{ item.inquiryNotes.trim() || "No notes" }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
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
.updating {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-muted);
}
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.filter,
.filterCurrent {
  margin: 0;
  padding: 0.25rem 0.75rem;
  font: inherit;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  cursor: pointer;
}
.filter {
  color: inherit;
  background: transparent;
  border: 1px solid var(--color-border);
}
.filterCurrent {
  color: var(--color-on-accent);
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
}
.results {
  margin-top: 2rem;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: inherit;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.375rem;
}
.item:hover {
  border-color: var(--color-accent);
}
.status {
  font-size: 0.875rem;
  color: var(--color-muted);
}
</style>
