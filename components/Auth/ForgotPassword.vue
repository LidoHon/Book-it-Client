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
                  <UILoading />
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
