<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import { bookStore } from "~/stores/book";

const usebookStore = bookStore();
const searchQuery = ref("");
const fetchBooks = async () => {
  await usebookStore.getBooks(searchQuery.value);
};

onMounted(() => {
  fetchBooks();
});

const toast = useToast();
const auth = authStore();
const router = useRouter();

onMounted(async () => {
  await auth.getProfile();
});

const id = auth.userId;
const isAuthenticated = computed(() => auth.isAuthed);
console.log("the user is authenticated?", isAuthenticated);
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
    toast.success("you have logged out successfully");
    router.push("/");
  } else {
    toast.error("unable to logout");
  }
};
</script>
<template>
  <div v-if="isAuthenticated">
    <div
      class="navbar bg-base-100 container mx-auto rounded-xl border-1 border-cyan-200 border-b shadow-md sticky top-0 z-50 custom-navbar"
    >
      <div class="flex-1">
        <a class="btn btn-ghost text-xl text-black">Let's Get You a Book</a>
      </div>

      <!-- Show search and profile if user is logged in -->
      <div v-if="user">
        <div class="flex-row flex gap-2">
          <div class="form-control">
            <input
              v-model="searchQuery"
              @input="fetchBooks"
              type="text"
              placeholder="Search books..."
              class="input input-bordered w-24 md:w-auto rounded-full"
            />
          </div>
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
  </div>
</template>

<style scoped>
.custom-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  /* Optional border for separation */
}

.main-container {
  min-height: 100vh; /* Ensure enough height for scrolling */
}

.content {
  height: 2000px; /* Tall content to test scrolling */
  padding: 1rem;
}
</style>
