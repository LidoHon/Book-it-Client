<script setup>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import { ref } from "vue";
import { useRouter } from "vue-router";

const passwordReset = ref(true);
const forgotPasswordError = ref({ email: "" });
const isMessageOn = ref(false);
const isResetLoading = ref(false);
const toast = useToast();
const router = useRouter();
const useAuthStore = authStore();

const emailRegex = /^((?!\.)[\w_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
const errorMessage = {
  email: {
    required: "Email field is required!",
    not_email: "Sorry, it is not an email address!",
    invalid_email: "Invalid email address!",
  },
};

const schema = yup.object({
  email: yup
    .string()
    .required(errorMessage.email.required)
    .email(errorMessage.email.not_email)
    .matches(emailRegex, errorMessage.email.invalid_email),
});

const handleForgotPassword = async (value) => {
  isResetLoading.value = true;
  useAuthStore.changeOnLoad(false);
  const result = await useAuthStore.forgotPassword(value);
  if (result === true) {
    isMessageOn.value = true;
    toast.success("The request is submitted successfully!");
    toast.info("Please check your email!");
    passwordReset.value = false;
  } else {
    const message =
      useAuthStore.$state.errorMessage ||
      "Something went wrong! Please try again.";
    toast.error(message);
    useAuthStore.setErrorMessage("");
  }
  isResetLoading.value = false;
};
</script>

<template>
  <div>
    <div v-if="passwordReset" class="w-full">
      <div class="pt-5 space-y-6">
        <div class="flex flex-col items-center justify-center">
          <h1 class="font-bold text-xl">Reset Password</h1>
          <p class="text-xs">
            Fill in your e-mail address below and we will send you an email with
            further instructions.
          </p>
        </div>
        <div>
          <Form
            :validation-schema="schema"
            @submit="handleForgotPassword"
            v-slot="{ errors }"
          >
            <Field
              name="email"
              label="Email"
              placeholder="Enter your email"
              as="input"
              class="block w-full px-8 py-2 input input-bordered border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p class="text-red-500 text-xs mt-1">{{ errors.email }}</p>

            <div class="flex justify-center mt-4">
              <button
                type="submit"
                class="bg-cyan-200 border-2 rounded-full px-6 mb-2 py-2 hover:bg-cyan-600"
                :disabled="isResetLoading"
              >
                <span v-if="!isResetLoading">Password Reset</span>
                <div
                  class="w-full flex items-center justify-center gap-2"
                  v-else
                >
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="#1C64F2"
                    />
                  </svg>
                  Loading...
                </div>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <div
      v-else
      class="w-full h-full flex flex-col justify-center items-center gap-5 p-5"
    >
      <div
        class="w-[60%] h-fit flex items-center justify-center overflow-hidden"
      >
        <img
          class="w-full h-full object-cover"
          src="../../assets/img/Email.png"
          alt=""
        />
      </div>
      <p class="font-Roboto text-gray-300 text-center dark:text-gray-300">
        We sent an email to the address you provided. Please confirm to change
        your password.
      </p>
    </div>
  </div>
</template>
