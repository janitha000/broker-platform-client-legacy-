<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div>
    <nav class="nav" aria-label="Cases">
      <NuxtLink to="/cases" exact-active-class="current">Cases</NuxtLink>
      <NuxtLink to="/cases/board" exact-active-class="current">Board</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  gap: var(--space-4, 1rem);
  margin-bottom: var(--space-5, 1.5rem);
}

.nav :deep(a) {
  text-decoration: none;
  color: inherit;
}

.nav :deep(a.current) {
  color: #1f6b4a;
}
</style>
