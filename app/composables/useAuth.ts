const LEGACY_SESSION_KEY = "broker.session";

export function useAuth() {
  const user = useState<AuthUser | null>("auth-user", () => null);
  const ready = useState<boolean>("auth-ready", () => false);

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
  }

  function signOut() {
    user.value = null;
    beginLogout();
  }

  function sessionUnauthorized() {
    user.value = null;
    void navigateTo("/login", { replace: true });
  }

  function forgetLegacySession() {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }

  return {
    user,
    ready,
    restoreSession,
    register,
    signOut,
    sessionUnauthorized,
    forgetLegacySession,
  };
}
