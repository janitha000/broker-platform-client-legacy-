export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);
  const ready = ref(false);

  async function restoreSession() {
    try {
      user.value = await getMe();
    } catch {
      user.value = null;
    } finally {
      ready.value = true;
    }
  }

  async function register(input: {
    name: string;
    email: string;
    password: string;
  }) {
    user.value = await registerTenant(input.name, input.email, input.password);
    beginLogin();
  }

  function sessionCleared() {
    user.value = null;
  }

  function signOut() {
    sessionCleared();
    beginLogout();
  }

  function sessionUnauthorized() {
    sessionCleared();
    void navigateTo("/login", { replace: true });
  }

  return {
    user,
    ready,
    restoreSession,
    register,
    sessionCleared,
    signOut,
    sessionUnauthorized,
  };
});
