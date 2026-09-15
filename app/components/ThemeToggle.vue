<script setup lang="ts">
const { theme, setTheme } = useTheme();
const isDark = computed(() => theme.value === Theme.Dark);
</script>

<template>
  <AppButton
    variant="secondary"
    type="button"
    :aria-pressed="isDark"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="setTheme(isDark ? Theme.Light : Theme.Dark)"
  >
    {{ isDark ? "Light" : "Dark" }}
  </AppButton>
</template>
