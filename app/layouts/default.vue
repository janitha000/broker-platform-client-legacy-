<script setup lang="ts">
const { user, signOut, canReadAudit } = useAuth();
</script>

<template>
  <div class="frame">
    <header class="header">
      <p class="brand">
        <NuxtLink to="/cases">Broker</NuxtLink>
      </p>
      <div class="tools">
        <p class="email">{{ user?.email }}</p>
        <ThemeToggle />
        <AppButton variant="secondary" type="button" @click="signOut">
          Sign out
        </AppButton>
      </div>
    </header>
    <nav class="nav" aria-label="Main">
      <NuxtLink to="/cases" exact-active-class="current">Cases</NuxtLink>
      <NuxtLink to="/cases/board" exact-active-class="current">Board</NuxtLink>
      <NuxtLink v-if="canReadAudit" to="/audit" exact-active-class="current">
        Audit
      </NuxtLink>
    </nav>
    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.frame {
  width: min(24rem, calc(100% - var(--space-8, 3rem)));
  margin-inline: auto;
  padding-block: var(--space-8, 3rem);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4, 1rem);
  margin-bottom: var(--space-5, 1.5rem);
}

.brand {
  margin: 0;
  font-size: var(--font-size-lg, 1.125rem);
  font-weight: 600;
  line-height: 1.2;
}

.brand :deep(a) {
  color: inherit;
  text-decoration: none;
}

.tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-2, 0.5rem);
}

.email {
  margin: 0;
  font-size: var(--font-size-sm, 0.875rem);
  color: var(--color-muted);
}

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
  color: var(--color-accent);
}
</style>
