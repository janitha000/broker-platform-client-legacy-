<script setup lang="ts">
const config = useRuntimeConfig();
</script>

<template>
  <section class="hero">
    <h1>client-legacy</h1>
    <p>
      This is a Nuxt 4 SPA. Routes come from files in
      <code>app/pages/</code>. Shared chrome lives in
      <code>app/layouts/</code>.
    </p>
    <ul>
      <li>
        Identity API:
        <code>{{ config.public.identityApiUrl || "/auth (dev proxy)" }}</code>
      </li>
      <li>
        Origination API:
        <code>{{ config.public.originationApiUrl || "/cases (dev proxy)" }}</code>
      </li>
    </ul>
  </section>
</template>
