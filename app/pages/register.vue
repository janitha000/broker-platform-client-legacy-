<script setup lang="ts">
definePageMeta({
  layout: "guest",
  middleware: "guest",
});

const { register } = useAuth();
const name = ref("");
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);
const pending = ref(false);

async function onSubmit() {
  error.value = null;
  pending.value = true;
  try {
    await register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    await navigateTo("/cases", { replace: true });
  } catch (caught) {
    if (caught instanceof ApiError && caught.status === 409) {
      error.value = "That email is already registered.";
    } else {
      error.value = "Could not register. Is Identity running?";
    }
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <h1>Register brokerage</h1>
  <form class="form" @submit.prevent="onSubmit">
    <label>
      Brokerage name
      <input v-model="name" type="text" autocomplete="organization" required />
    </label>
    <label>
      Email
      <input v-model="email" type="email" autocomplete="email" required />
    </label>
    <label>
      Password
      <input
        v-model="password"
        type="password"
        autocomplete="new-password"
        required
      />
    </label>
    <p v-if="error" role="alert">{{ error }}</p>
    <AppButton type="submit" :disabled="pending">
      {{ pending ? "Registering…" : "Register" }}
    </AppButton>
  </form>
  <p>
    Already have an account?
    <NuxtLink to="/login">Sign in</NuxtLink>
  </p>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
</style>
