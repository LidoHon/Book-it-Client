<script setup>
import { onMounted, ref } from "vue";
import { authStore } from "~/stores/auth";

const auth = authStore();
const isAuthenticated = ref(false);
const id = ref("");
const name = ref("");
const user = ref({});

onMounted(() => {
  // Initialize auth state on page load
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
  <div>
    <p>Welcome!</p>
    <p>User ID: {{ id }}</p>
    <p>User Name: {{ name }}</p>
  </div>
</template>
