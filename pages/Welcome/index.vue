<script setup>
import { onMounted, ref } from "vue";
import { authStore } from "~/stores/auth";

// Reactive state
const auth = authStore();
const isAuthenticated = ref(false);
const id = ref("");
const name = ref("");
const user = ref({});

onMounted(() => {
  // Initialize authentication state
  auth.initAuthState();

  // Sync reactive values with the store
  isAuthenticated.value = auth.isAuthed;
  id.value = auth.userId;
  name.value = auth.user?.userName || "";
  user.value = auth.user;

  // Log values for debugging
  console.log("Name:", name.value);
  console.log("User data:", user.value);
  console.log("ID:", id.value);
  console.log("Is authenticated?", isAuthenticated.value);
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6"
  >
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
      <h1 class="text-2xl font-semibold text-gray-800 mb-4">
        We have sent a verification email to your provided email address
      </h1>
      <p class="text-gray-600 mb-6">
        Welcome! Please verify your email to proceed.
      </p>
      <NuxtLink
        to="https://mail.google.com/mail/u/0/#inbox"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-600 hover:underline font-medium"
      >
        Go to your email inbox
      </NuxtLink>
    </div>
  </div>
</template>
