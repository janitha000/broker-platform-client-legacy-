<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <h1>Case {{ route.params.caseId }}</h1>
</template>
