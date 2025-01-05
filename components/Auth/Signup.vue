<script setup>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";

const toast = useToast();

useSeoMeta({
  title: "bookit | Signup",
  description: "The booking app Meta.",
});

definePageMeta({
  layout: "auth",
});

const useAuthStore = authStore();
const MAX_FILE_SIZE = 2097152;
const router = useRouter();

const getExtension = (filename) => {
  const extension = filename.split(".");
  return extension[1];
};

const image = ref({
  name: "",
  type: "",
  base64String: "",
});

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    image.value.name = file.name;
    image.value.type = file.type;
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.match(/base64,(.*)$/)[1];
      image.value.base64String = base64String;
    };
    reader.readAsDataURL(file);
    reader.onerror = (error) => {
      console.log("there is some error in image uploading: ", error);
      reject(error);
    };
  }
};

const signupError = ref({
  userName: "",
  email: "",
  password: "",
  passwordConfirmation: "",
  phone: "",
  profile: "",
});

const nameregex = /^([^\x00-\x7F]|[\a-zA-Z_\ \.\+\-]){2,20}$/;
const emailregex = /^((?!\.)[\w_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
const phoneregex = /^(^\+251|^251|^0)?(9|7)\d{8}$/;
const passwordCapitalLetter = /^((?=\S*?[A-Z]).{8,})\S$/;
const passwordNumber = /^((?=\S*?[0-9]).{8,})\S$/;

const errorMessages = {
  email: {
    required: "Email field is required!",
    not_email: "Sorry it is not an email address!",
    invalid_email: "Invalid email address!",
  },
  password: {
    required: "Password field is required!",
    min_password_len: "The minimum length of password is 6",
    not_valid_password_capitalizer:
      "Atleast there is 1 capital letter in the password",
    not_vaild_password_digit: "Password also must have a digit in it",
  },
  userName: {
    invalid_username: "Invalid user name",
  },
  passwordConfirmation: {
    must_be_same: "Password confirmation must be same with password",
  },
  phone: {
    invalid_phone: "Invalid phone address",
  },
};
const schema = yup.object({
  userName: yup
    .string()
    .required()
    .matches(nameregex, errorMessages.userName.invalid_username),
  email: yup
    .string()
    .required(errorMessages.email.required)
    .email(errorMessages.email.not_email)
    .matches(emailregex, errorMessages.email.invalid_email),
  password: yup
    .string()
    .required(errorMessages.password.required_password)
    .min(8, errorMessages.password.min_password_len)
    .matches(
      passwordCapitalLetter,
      errorMessages.password.not_valid_password_capitalzer
    )
    .matches(passwordNumber, errorMessages.password.not_vaild_password_digit),
  passwordConfirmation: yup
    .string()
    .required()
    .oneOf(
      [yup.ref("password"), null],
      errorMessages.passwordConfirmation.must_be_same
    ),
  phone: yup
    .string()
    .required()
    .matches(phoneregex, errorMessages.phone.invalid_phone),
  profile: yup
    .mixed()
    .test({
      message: "Please provide supported file type",
      test: (file, context) => {
        let isValid;
        if (file) {
          isValid = [
            "jpg",
            "gif",
            "png",
            "jpeg",
            "svg",
            "webp",
            "jpeg",
          ].includes(getExtension(file?.name));
        } else {
          isValid = true;
        }
        if (!isValid) {
          context?.createError();
        }
        return isValid;
      },
    })
    .test({
      message: "File is too big, cant exit 2Mb",
      test: (file) => {
        let isValid;
        if (file) {
          isValid = file?.size < MAX_FILE_SIZE;
        } else {
          isValid = true;
        }
        return isValid;
      },
    }),
});

const handleSigningUp = async (value) => {
  useAuthStore.changeOnLoad(true);
  let payload;
  if (
    image.value.name !== "" ||
    image.value.type !== "" ||
    image.value.base64String !== ""
  ) {
    payload = {
      userName: value.userName,
      email: value.email,
      password: value.password,
      phone: value.phone,
      imageName: image.value.name,
      imageType: image.value.type,
      imageString: image.value.base64String,
    };
  } else {
    payload = {
      userName: value.userName,
      email: value.email,
      password: value.password,
      phone: value.phone,
    };
  }
  const result = await useAuthStore.signupUser(payload);
  console.log("the result i wanna see", result);
  if (result) {
    toast.success(
      "Welcome to bookit, check your email to verify your account!"
    );
    router.push("/books");
  } else {
    if (useAuthStore.$state.errorMessage) {
      const message = useAuthStore.$state.errorMessage;
      toast.error(message);
      useAuthStore.setErrorMessage("");
    } else {
      toast.error("what the fuck");
    }
  }
};
</script>

<template>
  <div
    class="w-full border-2 border-cyan-100 shadow-lg rounded-lg items-center justify-center px-2 sm:px-6 lg:flex-none lg:px-4 xl:px-6"
  >
    <div class="w-full pt-20 px-6 py-8 md:px-8">
      <Form
        @submit="handleSigningUp"
        :validation-schema="schema"
        v-slot="{ errors }"
        class="w-full flex-col gap-4 items-center justify-center"
      >
        <UIInput
          name="userName"
          placeholder="Insert Your Full Name"
          label-text="User Name"
          :error-message="
            errors.userName
              ? errors.userName
              : signupError.userName
              ? signupError.userName
              : ''
          "
          :is-required="true"
        />
        <UIInput
          name="email"
          placeholder="Insert Your Email"
          label-text="Email"
          :error-message="
            errors.email
              ? errors.email
              : signupError.email
              ? signupError.email
              : ''
          "
          :is-required="true"
        />
        <UIInput
          name="password"
          placeholder="Insert Your Password"
          label-text="password"
          :is-required="true"
          type="password"
          :error-message="
            errors.password
              ? errors.password
              : signupError.password
              ? signupError.password
              : ''
          "
          :is-password="true"
        />
        <UIInput
          name="passwordConfirmation"
          placeholder="Confirm Your Password"
          label-text="Password Confirmation"
          :is-required="true"
          type="password"
          :error-message="
            errors.passwordConfirmation
              ? errors.passwordConfirmation
              : signupError.passwordConfirmation
              ? signupError.passwordConfirmation
              : ''
          "
        />
        <UIInput
          name="phone"
          placeholder="Insert your phone"
          label-text="Phonenumber"
          :is-required="true"
          type="text"
          :error-message="
            errors.phone
              ? errors.phone
              : signupError.phone
              ? signupError.phone
              : ''
          "
        />
        <div class="w-full flex flex-col sm:mb-3 justify-center gap-2">
          <label for="" class="text-gray-200">Profile </label>
          <UIImage
            name="profile"
            @image-changed="handleFileChange"
            :error-message="
              errors.profile
                ? errors.profile
                : signupError.profile
                ? signupError.profile
                : ''
            "
          />
        </div>
        <div class="mt-6">
          <button
            class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
          >
            <span v-if="useAuthStore.$state.onLoad == false"> Sign Up </span>
            <div class="w-full flex items-center justify-center gap-2" v-else>
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

      <div class="flex items-center justify-between mt-4">
        <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

        <NuxtLink
          to="/auth/login"
          class="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
          >or sign in</NuxtLink
        >

        <span class="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
      </div>
    </div>
  </div>
</template>
