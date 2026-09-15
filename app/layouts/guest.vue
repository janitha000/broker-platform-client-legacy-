<template>
  <div class="frame">
    <header class="header">
      <p class="brand">Broker</p>
      <ThemeToggle />
    </header>
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
</style>
