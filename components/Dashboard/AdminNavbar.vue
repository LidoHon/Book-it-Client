<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import { authStore } from "~/stores/auth";

const toast = useToast();
const auth = authStore();
const router = useRouter();

const isAuthenticated = computed(() => auth.isAuthed);
const user = computed(() => auth.user);
const userInitials = computed(() => {
  const name = user.value?.userName || "";
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
});

const handleLogout = async () => {
  const result = await auth.logout();
  if (result) {
    toast.success("You have logged out successfully");
    router.push("/");
  } else {
    toast.error("Unable to logout");
  }
};
</script>

<template>
  <div v-if="isAuthenticated">
    <div
      class="navbar bg-base-100 container mx-auto rounded-xl border-1 border-cyan-200 border-b shadow-md sticky top-0 z-50 custom-navbar"
    >
      <div class="flex-1">
        <a class="btn btn-ghost text-xl text-black">Admin Panel</a>
      </div>

      <!-- Buttons and Profile -->
      <div v-if="user">
        <div class="flex-row flex gap-4 items-center">
          <!-- Add Books Button -->
          <NuxtLink
            to="/admin/addbooks"
            class="btn btn-primary rounded-full text-white"
          >
            Add Books
          </NuxtLink>

          <!-- Dashboard Button -->
          <NuxtLink
            to="/admin/dashboard"
            class="btn btn-secondary rounded-full text-white"
          >
            Dashboard
          </NuxtLink>

          <!-- User Profile Dropdown -->
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <div class="w-10 rounded-full">
                <img
                  :src="auth.$state.user.profile"
                  :alt="`${auth.$state.user.username}'s profile`"
                />
              </div>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NuxtLink :to="`/profile`" class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </NuxtLink>
              </li>
              <li>
                <NuxtLink :to="`/`" class="justify-between"> Home </NuxtLink>
              </li>
              <li><NuxtLink to="#">Settings</NuxtLink></li>
              <li><button @click="handleLogout">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.custom-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.main-container {
  min-height: 100vh;
}

.content {
  height: 2000px; /* Tall content to test scrolling */
  padding: 1rem;
}
</style>
