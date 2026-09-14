<script setup lang="ts">
definePageMeta({
  layout: false,
});

const { user } = useAuth();
await navigateTo(user.value ? "/cases" : "/login", { replace: true });
</script>
