export default defineNuxtRouteMiddleware(() => {
  const { user } = useAuth();
  if (user.value) {
    return navigateTo("/cases", { replace: true });
  }
});
