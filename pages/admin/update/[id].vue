<script setup>
import { ref } from "vue";
import { Form, Field } from "vee-validate";
import { useToast } from "vue-toast-notification";
import * as yup from "yup";


const useBookStore = bookStore();
const MAX_FILE_SIZE = 2097152;
const router = useRouter();
const route = useRoute();
const toast = useToast();
const getExtension = (filename) => {
  const extension = filename.split(".");
  return extension[1];
};

const bookId = route.params.id;
console.log("idddddddddddddd", bookId);

const InsertBookError = ref({
  title: "",
  avaiable: "",
  author: "",
  genre: "",
  image: "",
});

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

const handleUpdateBook = async (value) => {
  useBookStore.isLoading = true;
  let payload;

  if (
    image.value.name !== "" ||
    image.value.type !== "" ||
    image.value.base64String !== ""
  ) {
    payload = {
      book_id: bookId,
      title: value.title,
      author: value.author,
      genre: value.genre,
      imageName: image.value.name,
      imageType: image.value.type,
      base64String: image.value.base64String,
    };
  } else {
    payload = {
      book_id: bookId,
      title: value.title,
      author: value.author,
      genre: value.genre,
    };
  }
  if (value.available !== undefined) {
    payload.available = value.available;
  }

  const res = await useBookStore.updateBook(payload);
  console.log("the respons from update book", res);
  if (res) {
    toast.success("book updated successfully");
    await useBookStore.getBooks();
  } else {
    if (useBookStore.$state.errorMessages) {
      const message = useBookStore.$state.errorMessages;
      toast.error(message);
    } else {
      toast.error("something went wrong try again");
    }
  }
};
</script>

<template>
  <div
    class="max-w-4xl mx-auto p-6 card border-2 shadow-lg shadow-cyan-100 mt-4"
  >
    <h1 class="text-4xl font-bold items-center mb-4 underline">update book</h1>
    <Form
      @submit="handleUpdateBook"
      :validation-schema="schema"
      v-slot="{ errors }"
      class="space-y-6 card-body"
    >
      <!-- Title Input -->
      <UIInput
        name="title"
        placeholder="Insert the title of the book"
        label="Title"
        :error-message="errors.title || InsertBookError.title || ''"
        :is-required="true"
        class="w-full"
      />

      <!-- Author Input -->
      <UIInput
        name="author"
        placeholder="Insert the name of the author"
        label="Author"
        :error-message="errors.author || InsertBookError.author || ''"
        :is-required="true"
        class="w-full"
      />

      <!-- Genre Input -->
      <UIInput
        name="genre"
        placeholder="Insert the genre of the book"
        label="Genre"
        :error-message="errors.genre || InsertBookError.genre || ''"
        :is-required="true"
        class="w-full"
      />

      <!-- Book Image Upload -->
      <div class="flex flex-col gap-2">
        <label for="image" class="text-gray-700">Book Image</label>
        <UIImage
          name="image"
          @image-changed="handleFileChange"
          :error-message="errors.image || InsertBookError.image || ''"
          class="w-full"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex justify-center mt-6">
        <button
          type="submit"
          class="flex items-center justify-center gap-2 rounded-full bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700 transition-colors duration-300"
        >
          <span v-if="!useBookStore.$state.isLoading">Update Book</span>
          <div v-else class="flex items-center gap-2">
            <UILoading />
          </div>
        </button>
      </div>
    </Form>
  </div>
</template>
