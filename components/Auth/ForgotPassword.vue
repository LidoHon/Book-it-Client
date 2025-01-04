<script setup>
import { reactive, ref } from "vue";
import { useToast } from "vue-toast-notification";

const data = reactive({
  email: "",
  loading: false,
});

const passwordReset = ref(true);
const toast = useToast();

async function handlePasswordReset() {
  console.log("email:", data.email);

  data.loading = true;

  setTimeout(() => {
    // Stop loading
    data.loading = false;

    passwordReset.value = false;

    toast.success("Password reset email sent successfully!", {
      position: "top-right",
      duration: 5000,
    });
  }, 2000);
}
</script>

<template>
  <div v-if="passwordReset" class="w-full">
    <div class="pt-5 space-y-6">
      <div class="flex flex-col items-center justify-center">
        <h1 class="font-bold text-xl">Reset Password</h1>
        <p class="text-xs">
          Fill in your e-mail address below and we will send you an email with
          further instructions.
        </p>
      </div>
      <UIInput v-model="data.email" label="email" placeholder="@email" />

      <div class="flex justify-center mt-4">
        <button
          class="bg-cyan-200 border-2 rounded-full px-6 mb-2 py-2 hover:bg-cyan-600"
          @click="handlePasswordReset"
          :disabled="data.loading"
        >
          Reset Password
        </button>
      </div>
    </div>
  </div>
</template>
