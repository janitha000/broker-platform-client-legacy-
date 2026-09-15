<script setup lang="ts">
const route = useRoute();
const caseId = computed(() => String(route.params.caseId ?? ""));

const { data, pending, error, refresh } = await useCaseDetail(caseId);

const saving = ref(false);
const saveError = ref<string | null>(null);
const fieldErrors = ref<Partial<Record<keyof FactFindPayload, string>>>({});

const loadError = computed(() => {
  const err = error.value;
  if (!err) {
    return null;
  }
  if (toApiError(err)?.status === 404) {
    return "This case was not found for your brokerage.";
  }
  if (isIgnorableAuthError(err)) {
    return null;
  }
  return "Could not load this case. Is Origination reachable?";
});

function parseMoney(
  raw: string,
  field: keyof FactFindPayload,
  errors: Partial<Record<keyof FactFindPayload, string>>,
): number {
  const value = raw.trim();
  if (!value) {
    errors[field] = "Enter an amount.";
    return 0;
  }
  if (!/^\d+(\.\d{1,2})?$/.test(value)) {
    errors[field] = "Use a number with up to 2 decimal places.";
    return 0;
  }
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    errors[field] = "Amount cannot be negative.";
    return 0;
  }
  return amount;
}

function parseFactFind(form: HTMLFormElement): FactFindPayload | null {
  const data = new FormData(form);
  const errors: Partial<Record<keyof FactFindPayload, string>> = {};
  const objectives = String(data.get("objectives") ?? "").trim();
  if (!objectives) {
    errors.objectives = "Enter objectives.";
  }
  const payload: FactFindPayload = {
    objectives,
    income: parseMoney(String(data.get("income") ?? ""), "income", errors),
    expenses: parseMoney(
      String(data.get("expenses") ?? ""),
      "expenses",
      errors,
    ),
    assets: parseMoney(String(data.get("assets") ?? ""), "assets", errors),
    debts: parseMoney(String(data.get("debts") ?? ""), "debts", errors),
  };
  if (Object.keys(errors).length > 0) {
    fieldErrors.value = errors;
    return null;
  }
  fieldErrors.value = {};
  return payload;
}

async function onCompleteFactFind(event: Event) {
  const form = event.target as HTMLFormElement;
  const payload = parseFactFind(form);
  if (!payload) {
    return;
  }
  saveError.value = null;
  saving.value = true;
  try {
    await completeFactFind(caseId.value, payload);
    await refresh();
  } catch (caught) {
    const apiError = toApiError(caught);
    if (apiError?.status === 400) {
      const mapped = fieldErrorsFromProblem(apiError.fieldErrors);
      if (Object.keys(mapped).length > 0) {
        fieldErrors.value = mapped;
        return;
      }
    }
    if (apiError?.status !== 401) {
      saveError.value = apiError?.title ?? "Could not save the fact-find.";
    }
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <h1>Case</h1>

  <p v-if="pending && !data">Loading…</p>
  <p v-else-if="loadError">
    {{ loadError }}
    <AppButton variant="secondary" type="button" @click="() => refresh()">
      Retry
    </AppButton>
  </p>
  <template v-else-if="data">
    <span class="status">
      {{ data.status }}
      <span v-if="pending" class="updating"> Updating… </span>
    </span>
    <p class="notes">{{ data.inquiryNotes.trim() || "No enquiry notes." }}</p>
    <p v-if="saveError" role="alert">{{ saveError }}</p>

    <form
      v-if="data.status === 'Enquiry'"
      class="form"
      @submit.prevent="onCompleteFactFind"
    >
      <label>
        Objectives
        <input name="objectives" type="text" />
        <span v-if="fieldErrors.objectives" role="alert">{{
          fieldErrors.objectives
        }}</span>
      </label>
      <label>
        Income
        <input name="income" inputmode="decimal" autocomplete="off" />
        <span v-if="fieldErrors.income" role="alert">{{
          fieldErrors.income
        }}</span>
      </label>
      <label>
        Expenses
        <input name="expenses" inputmode="decimal" autocomplete="off" />
        <span v-if="fieldErrors.expenses" role="alert">{{
          fieldErrors.expenses
        }}</span>
      </label>
      <label>
        Assets
        <input name="assets" inputmode="decimal" autocomplete="off" />
        <span v-if="fieldErrors.assets" role="alert">{{
          fieldErrors.assets
        }}</span>
      </label>
      <label>
        Debts
        <input name="debts" inputmode="decimal" autocomplete="off" />
        <span v-if="fieldErrors.debts" role="alert">{{
          fieldErrors.debts
        }}</span>
      </label>
      <AppButton type="submit" :disabled="saving">
        {{ saving ? "Saving…" : "Complete fact-find" }}
      </AppButton>
    </form>

    <dl v-else-if="data.factFind" class="facts">
      <dt>Objectives</dt>
      <dd>{{ data.factFind.objectives }}</dd>
      <dt>Income</dt>
      <dd>{{ formatMoney(data.factFind.income) }}</dd>
      <dt>Expenses</dt>
      <dd>{{ formatMoney(data.factFind.expenses) }}</dd>
      <dt>Assets</dt>
      <dd>{{ formatMoney(data.factFind.assets) }}</dd>
      <dt>Debts</dt>
      <dd>{{ formatMoney(data.factFind.debts) }}</dd>
      <dt>Completed</dt>
      <dd>{{ formatDateTime(data.factFind.completedAt) }}</dd>
    </dl>
  </template>

  <NuxtLink class="back" to="/cases">All cases</NuxtLink>
</template>

<style scoped>
.status {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}
.updating {
  font-weight: 400;
}
.notes {
  margin-top: 1rem;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.facts {
  margin: 1rem 0 0;
  display: grid;
  gap: 0.5rem;
}
.facts dt {
  font-size: 0.875rem;
  color: #6b7280;
}
.facts dd {
  margin: 0;
}
.back {
  display: inline-block;
  margin-top: 2rem;
}
</style>
