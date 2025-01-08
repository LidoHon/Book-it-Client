export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    const useAuthStore = authStore();
    await useAuthStore.initAuthState();
    if (useAuthStore.$state.isAuthed) {
      useAuthStore.getRole();
      if (useAuthStore.$state.isAdmin && useAuthStore.$state.role == "admin") {
        if (
          useAuthStore.isAnonymousPage(to.name) ||
          useAuthStore.isAuthPage(to.name) ||
          !useAuthStore.isAdminPage(to.name)
        ) {
          return navigateTo({ name: "admin-dashboard" });
        }
      } else {
        if (
          useAuthStore.isAuthPage(to.name) ||
          useAuthStore.isAdminPage(to.name)
        ) {
          return navigateTo("/");
        }
      }
    } else {
      if (!useAuthStore.isAnonymousPage(to.name)) {
        return navigateTo("/");
      }
    }
  }
});
