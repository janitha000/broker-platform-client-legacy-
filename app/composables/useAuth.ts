const LEGACY_SESSION_KEY = "broker.session";

export function useAuth() {
  const store = useAuthStore();
  const { user, ready } = storeToRefs(store);

  function forgetLegacySession() {
    localStorage.removeItem(LEGACY_SESSION_KEY);
  }

  return {
    user,
    ready,
    restoreSession: store.restoreSession,
    register: store.register,
    signOut: store.signOut,
    sessionUnauthorized: store.sessionUnauthorized,
    forgetLegacySession,
  };
}
