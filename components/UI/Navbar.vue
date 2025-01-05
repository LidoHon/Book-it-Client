<template>
  <div v-if="isAuthenticated">
    <div
      class="navbar bg-base-100 container mx-auto rounded-xl border-1 border-cyan-200 border-b shadow-md sticky top-0"
    >
      <div class="flex-1">
        <a class="btn btn-ghost text-xl text-black">Let's Get You a Book</a>
      </div>

      <!-- Show search and profile if user is logged in -->
      <div v-if="user">
        <div class="flex-row flex gap-2">
          <div class="form-control">
            <input
              type="text"
              placeholder="Search"
              class="input input-bordered w-24 md:w-auto rounded-full"
            />
          </div>
          <div class="dropdown dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-ghost btn-circle avatar"
            >
              <!-- <div class="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div> -->
              <div
                class="w-10 rounded-full bg-gray-100 flex items-center justify-center text-lg text-black hover:bg-gray-600"
              >
                {{ userInitials }}
              </div>
            </div>
            <ul
              tabindex="0"
              class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NuxtLink :to="`/profile/${id}`" class="justify-between">
                  Profile
                  <span class="badge">New</span>
                </NuxtLink>
              </li>
              <li><NuxtLink to="#">Settings</NuxtLink></li>
              <li><NuxtLink to="#">Logout</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Show signup/signin button if user is not logged in -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const auth = authStore();
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
</script>
