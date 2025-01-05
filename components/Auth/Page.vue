<script setup>
import { ref } from "vue";

const showSignup = ref(false);

function toggleForm() {
  showSignup.value = !showSignup.value;
}
</script>

<template>
  <div class="flex h-screen w-full">
    <div class="relative flex-1 hidden w-0 lg:block">
      <img
        class="absolute inset-0 object-cover w-full h-full"
        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt="Background"
      />
    </div>

    <div
      class="flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 flex-1"
    >
      <!-- Form Toggle Button and Conditional Heading -->
      <div
        class="flex flex-row gap-4 pt-20 sm:items-center sm:justify-center lg:items-start lg:justify-start"
      >
        <h2 class="text-center border-b-2 border-black">
          {{
            showSignup
              ? "Already have an account?"
              : "You haven't signed up yet?"
          }}
        </h2>
        <button
          @click="toggleForm"
          class="text-cyan-400 p-2 rounded-full hover:text-cyan-900"
        >
          {{ showSignup ? "Login" : "Signup" }}
        </button>
      </div>

      <div class="flex items-center w-full max-w-sm mx-auto lg:w-96 mt-6">
        <div v-if="showSignup">
          <AuthSignup />
        </div>
        <div v-else>
          <AuthLogin />
        </div>
      </div>
    </div>
  </div>
</template>
