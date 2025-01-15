<template>
  <div
    class="unauthorized-page h-screen flex flex-col items-center justify-center text-center bg-pink-50 p-[50px] text-red-950 border-1"
  >
    <!-- SVG for restricted area -->
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.95 15.55L15.55 16.95L12 13.4L8.45 16.95L7.05 15.55L10.6 12L7.05 8.45L8.45 7.05L12 10.6L15.55 7.05L16.95 8.45L13.4 12L16.95 15.55Z"
        stroke="#000000"
        stroke-width="2"
      />
    </svg>
    <h1 class="text-4xl font-bold text-black mb-4">Restricted Area</h1>
    <p class="text-2xl font-semibold text-gray-800 mb-8">
      You do not have permission to view this page.
    </p>
    <div class="flex space-x-4">
      <!-- Go Back to Previous Page Button -->
      <button
        @click="goBack"
        class="px-6 py-3 bg-black rounded-full text-white hover:bg-gray-700 focus:outline-none"
      >
        Go Back
      </button>
      <!-- Go to Home Button -->
      <button
        @click="goHome"
        class="px-6 py-3 bg-black rounded-full text-white hover:bg-gray-700 focus:outline-none"
      >
        Go to Home
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

definePageMeta({
  layout: false,
});
const router = useRouter();

// Redirect the user back to the previous page
const goBack = () => {
  const previousRoute = window.sessionStorage.getItem("previousRoute");
  if (previousRoute) {
    router.push(previousRoute);
    window.sessionStorage.removeItem("previousRoute");
  } else {
    router.push("/");
  }
};

// Redirect the user to the home page
const goHome = () => {
  router.push("/");
};
</script>
