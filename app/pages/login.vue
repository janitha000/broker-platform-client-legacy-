<script setup lang="ts">
definePageMeta({
  layout: "guest",
  middleware: "guest",
});
</script>

<template>
  <h1>Sign in</h1>
  <AppButton type="button" @click="beginLogin()">Sign in</AppButton>
  <p>
    New brokerage?
    <NuxtLink to="/register">Register</NuxtLink>
  </p>
</template>
