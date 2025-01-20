<script setup>
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { useToast } from "vue-toast-notification";
import * as yup from "yup";

const toast = useToast();
const formatDate = useUtils().formatDate;
const getExtension = (filename) => {
  const extension = filename.split(".");
  return extension[1];
};
const MAX_FILE_SIZE = 2097152;
const useAuthStore = authStore();

const profileError = ref({
  userName: "",
  phone: "",
  profile: "",
});
const nameregex = /^([^\x00-\x7F]|[\a-zA-Z_\ \.\+\-]){2,20}$/;
const phoneregex = /^(^\+251|^251|^0)?(9|7)\d{8}$/;
const errorMessages = {
  userName: {
    invalid_username: "Invalid user name",
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
onMounted(async () => {
  await useAuthStore.getProfile();
});

const image = ref({
  name: "",
  type: "",
  base64String: "",
});

const handleUpdateProfle = async (value) => {
  useAuthStore.changeOnLoad(true);
  let payload;
  if (
    image.value.name !== "" ||
    image.value.type !== "" ||
    image.value.base64String !== ""
  ) {
    payload = {
      userName: value.userName,
      phone: value.phone,
      imageName: image.value.name,
      imageType: image.value.type,
      imageString: image.value.base64String,
    };
  } else {
    payload = {
      userName: value.userName,
      phone: value.phone,
    };
  }
  const result = await useAuthStore.updateProfile(payload);
  useAuthStore.changeOnLoad(false);
  if (result) {
    await useAuthStore.getProfile();
    if (
      useAuthStore.$state.successMessage &&
      useAuthStore.$state.successMessage.length > 0
    ) {
      const message = useAuthStore.$state.successMessage;
      useAuthStore.setSuccessMessage("");
      toast.success(message);
    } else {
      toast.success("Your profile updated successfully!");
    }
    showProfileUpdate.value = false;
  } else {
    if (
      useAuthStore.$state.errorMessage &&
      useAuthStore.$state.errorMessage.length > 0
    ) {
      const message = useAuthStore.$state.errorMessage;
      useAuthStore.setErrorMessage("");
      toast.error(message);
    } else {
      toast.error("Something wrong! please try again.");
    }
  }
};

const date = formatDate(useAuthStore.$state.user.created_at);

// Reactive state for toggling sections
const showProfileUpdate = ref(false);
// const rentedBooks = useAuthStore.rentedBooks;

const toggleProfileUpdate = () => {
  showProfileUpdate.value = !showProfileUpdate.value;
};
</script>

<template>
  <div class="min-h-screen container mx-auto bg-gray-100 p-6">
    <!-- Header Section -->
    <div class="flex items-center space-x-4">
      <div class="avatar online">
        <div class="w-24 rounded-full">
          <!-- <img
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            alt="User Avatar"
          /> -->
          <img
            :src="useAuthStore.$state.user.profile"
            :alt="`${useAuthStore.$state.user.username}'s profile`"
          />
        </div>
      </div>
      <div>
        <h1 class="text-2xl font-bold">
          {{ useAuthStore.$state.user.username }}
        </h1>
        <p class="text-gray-600">{{ useAuthStore.$state.user.email }}</p>
        <p class="text-gray-600">{{ useAuthStore.$state.user.phone }}</p>
        <p class="text-green-600">{{ useAuthStore.$state.user.role }}</p>
        <!-- <img
          :src="useAuthStore.$state.user.profile"
          :alt="`${useAuthStore.$state.user.username}'s profile`"
          class="w-24 h-24 rounded-full object-cover border border-gray-300"
        /> -->

        <p class="">
          Joined in:
          <span class="text-green-600">
            {{
              new Date(useAuthStore.$state.user.created_at).toLocaleDateString()
            }}</span
          >
        </p>
      </div>
      <button
        @click="toggleProfileUpdate"
        class="ml-auto px-4 py-2 bg-cyan-200 rounded-full text-black hover:bg-blue-100"
      >
        Update Profile
      </button>
    </div>

    <!-- Profile Update Section -->
    <transition name="slide">
      <div v-if="showProfileUpdate" class="mt-6 bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-bold mb-4">Update Profile</h2>
        <Form
          @submit="handleUpdateProfle"
          :validation-schema="schema"
          v-slot="{ errors }"
          class="space-y-4"
        >
          <div>
            <UIInput
              name="userName"
              type="text"
              placeholder="Jenter username"
              label="User Name"
              :is-required="true"
              :edit-mode="true"
              :value="
                useAuthStore.$state.user.username
                  ? useAuthStore.$state.username
                  : ''
              "
              :error-message="
                errors.userName
                  ? errors.userName
                  : profileError.userName
                  ? profileError.userName
                  : ''
              "
              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <UIInput
              name="phone"
              placeholder="Insert your new phonenumber"
              label="Phone Number"
              :is-required="true"
              :edit-mode="true"
              :value="
                useAuthStore.$state.user.phone
                  ? useAuthStore.$state.user.phone
                  : ''
              "
              type="text"
              :error-message="
                errors.phone
                  ? errors.phone
                  : profileError.phone
                  ? profileError.phone
                  : ''
              "
            />
          </div>
          <div class="w-full flex flex-col sm:mb-3 justify-center gap-2">
            <label
              for=""
              class="lock pl-3 ml-px text-sm font-medium text-gray-700"
              >Profile
            </label>
            <UIImage
              name="profile"
              @image-changed="handleFileChange"
              :error-message="
                errors.profile
                  ? errors.profile
                  : profileError.profile
                  ? profileError.profile
                  : ''
              "
            />
          </div>
          <div class="mt-6">
            <button
              class="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-cyan-800 rounded-full hover:bg-cyan-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
            >
              <span v-if="useAuthStore.$state.onLoad == false">
                Update Profile
              </span>
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
      </div>
    </transition>

    <!-- Sections -->
    <div class="mt-8">
      <!-- Rented Books Section -->
      <RentedBooks />

      <!-- Wishlist Section -->
      <Wishlist />
    </div>
  </div>
</template>

<style>
/* Add sliding animation for the profile update section */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
