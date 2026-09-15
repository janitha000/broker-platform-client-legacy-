<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: "primary" | "secondary";
    type?: "button" | "submit";
    disabled?: boolean;
  }>(),
  { variant: "primary", type: "button" },
);
</script>

<template>
  <button :type="type" class="button" :class="variant" :disabled="disabled">
    <slot />
  </button>
</template>

<style scoped>
.button {
  font: inherit;
  font-weight: 600;
  border-radius: 0.375rem;
  cursor: pointer;
}
.button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.primary {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--color-on-accent);
  background: var(--color-accent);
  border: 1px solid var(--color-accent);
}
.secondary {
  padding: 0.5rem 1rem;
  color: var(--color-heading);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
</style>
