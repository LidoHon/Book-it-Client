<script setup>
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";

useSeoMeta({
  title: "bookit | Add Books",
  description: "The booking app Meta.",
});

const useBookStore = bookStore();
const MAX_FILE_SIZE = 2097152;
const router = useRouter();
const toast = useToast();

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

const InsertBookError = ref({
  title: "",
  avaiable: "",
  author: "",
  genre: "",
  image: "",
});

const errorMessages = {
  title: {
    required: "title is required",
    min: "title must be greater than 2 characters",
  },
  author: {
    required: "Author is required",
    min: "Author must be greater than 2 characters",
  },
  genre: {
    required: "Genre is required",
    min: "Genre must be greater than 2 characters",
  },
};
const schema = yup.object({
  title: yup.string().required(errorMessages.title.required),
  author: yup
    .string()
    .required(errorMessages.author.required)
    .min(2, errorMessages.author.min),
  genre: yup
    .string()
    .required(errorMessages.genre.required)
    .min(2, errorMessages.genre.min),
  image: yup
    .mixed()
    .test("fileType", "Please provide a supported file type", (file) => {
      if (!file) return true;
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      return validTypes.includes(file.type);
    })
    .test("fileSize", "File is too big, can't exceed 2MB", (file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }),
});

const handleInsertBook = async (value) => {
  useBookStore.isLoading = true;
  let payload;
  if (
    image.value.name !== "" ||
    image.value.type !== "" ||
    image.value.base64String !== ""
  ) {
    payload = {
      title: value.title,
      available: true,
      author: value.author,
      genre: value.genre,
      imageName: image.value.name,
      imageType: image.value.type,
      imageString: image.value.base64String,
    };
  } else {
    payload = {
      title: value.title,
      available: true,
      author: value.author,
      genre: value.genre,
    };
  }

  const res = await useBookStore.insertBook(payload);
  console.log("the response from inserting book", res);
  if (res) {
    toast.success("Book added successfully");
    router.push("/");
  } else {
    if (useBookStore.$state.errorMessages) {
      const message = useBookStore.$state.errorMessages;
      toast.error(message);
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  }
};

</script>
<template>
  <div class="flex h-screen w-full">
    <!-- Left Image Section -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt="Background"
      />
    </div>

    <!-- Form Section -->
    <div class="flex w-full items-center justify-center px-4 sm:px-6 lg:px-8">
      <div
        class="w-full max-w-md rounded-lg border-2 border-cyan-100 bg-white p-8 shadow-lg"
      >
        <div class="text-4xl font-bold mb-4 mt-8">
          <h1>Add Book</h1>
        </div>
        <Form
          @submit="handleInsertBook"
          :validation-schema="schema"
          v-slot="{ errors }"
          class="flex flex-col gap-6"
        >
          <!-- Title Input -->
          <UIInput
            name="title"
            placeholder="Insert the title of the book"
            label="Title"
            :error-message="errors.title || InsertBookError.title || ''"
            :is-required="true"
          />

          <!-- Author Input -->
          <UIInput
            name="author"
            placeholder="Insert the name of the author"
            label="Author"
            :error-message="errors.author || InsertBookError.author || ''"
            :is-required="true"
          />

          <!-- Genre Input -->
          <UIInput
            name="genre"
            placeholder="Insert the genre of the book"
            label="Genre"
            :error-message="errors.genre || InsertBookError.genre || ''"
            :is-required="true"
          />

          <!-- Book Image Upload -->
          <div class="flex flex-col gap-2">
            <label for="image" class="text-gray-700">Book Image</label>
            <UIImage
              name="image"
              @image-changed="handleFileChange"
              :error-message="errors.image || InsertBookError.image || ''"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-6">
            <button
              class="flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-6 py-2 text-gray-700 hover:bg-cyan-600"
            >
              <span v-if="!useBookStore.$state.isLoading">Add Book</span>
              <div v-else class="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  role="status"
                  class="inline w-4 h-4 animate-spin text-gray-200"
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
</template>
