import { canReadAudit } from "~/utils/canReadAudit";

const LEGACY_SESSION_KEY = "broker.session";

export function useAuth() {
  const store = useAuthStore();
  const { user, ready } = storeToRefs(store);

  const canReadAuditAccess = computed(() => canReadAudit(user.value));

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
    canReadAudit: canReadAuditAccess,
  };
}
