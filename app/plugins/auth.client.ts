export default defineNuxtPlugin(async () => {
  const auth = useAuth();
  auth.forgetLegacySession();
  await auth.restoreSession();
  setUnauthorizedHandler(() => auth.sessionUnauthorized());
});
