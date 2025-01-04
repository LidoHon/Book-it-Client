<script setup>
import { reactive, ref } from "vue";
import { authStore } from "~/stores/auth";

const useAuthStore = authStore();

const data = reactive({
  email: "",
  password: "",
  loading: false,
});

// State to toggle visibility of Forgot Password component
const ResetPassword = ref(false);

async function handleLogin() {
  console.log("email:", data.email);
  console.log("password:", data.password);
  console.log(data.loading);

  data.loading = true;
}

function toggleForm() {
  ResetPassword.value = !ResetPassword.value;
}
</script>

<template>
  <div
    class="w-full border-2 border-cyan-100 shadow-lg rounded-lg items-center justify-center px-2 sm:px-6 lg:flex-none lg:px-4 xl:px-6"
  >
    <div class="pt-5 space-y-6">
      <UIInput v-model="data.email" label="email" placeholder="@email" />
      <UIInput
        label="Password"
        placeholder="********"
        type="password"
        v-model="data.password"
        :is-password="true"
      />

      <!-- Forgot password link that toggles the ResetPassword component -->
      <button
        @click="toggleForm"
        class="text-cyan-400 text-xs hover:text-cyan-950 cursor-pointer"
      >
        forgot password?
      </button>

      <div class="flex justify-center mt-4">
        <button
          class="bg-cyan-200 border-2 rounded-full px-6 mb-2 py-2 hover:bg-cyan-600"
          @click="handleLogin"
          :disabled="data.loading"
        >
          login
        </button>
      </div>

      <div v-if="ResetPassword">
        <AuthForgotPassword />
      </div>
    </div>
  </div>
</template>
