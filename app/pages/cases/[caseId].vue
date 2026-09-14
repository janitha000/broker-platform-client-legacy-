<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const route = useRoute();
</script>

<template>
  <h1>Case {{ route.params.caseId }}</h1>
</template>
