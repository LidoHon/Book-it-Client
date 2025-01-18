<template>
    <header class="sticky top-0 z-50 bg-gray-800 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3">
          <img src="/img/logo.png" alt="Admin Logo" class="h-10 w-10" />
          <span class="text-lg font-bold">Admin Panel</span>
        </div>
        <!-- Navigation Links -->
        <nav class="flex items-center gap-6">
          <NuxtLink
            to="/admin/dashboard"
            class="hover:text-gray-300 transition duration-200"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/admin/add-book"
            class="hover:text-gray-300 transition duration-200"
          >
            Add Book
          </NuxtLink>
          <NuxtLink
            to="/admin/manage-books"
            class="hover:text-gray-300 transition duration-200"
          >
            Manage Books
          </NuxtLink>
          <NuxtLink
            to="/admin/users"
            class="hover:text-gray-300 transition duration-200"
          >
            Manage Users
          </NuxtLink>
        </nav>
        <!-- Logout Button -->
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  </template>
  
  <script setup>
  import { useToast } from "vue-toast-notification";
  import { useRouter } from "vue-router";
  
  const toast = useToast();
  const router = useRouter();
  
  // Logout function
  const handleLogout = () => {
    try {
      // Add logout logic here (e.g., clearing tokens, session)
      toast.success("Logged out successfully");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      toast.error("Failed to log out");
      console.error("Logout error:", error);
    }
  };
  </script>
  
  <style scoped>
  /* Add custom styles for the header if needed */
  </style>
  