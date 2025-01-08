<script setup>
import { Field } from "vee-validate";

onMounted(() => {
  if (document.getElementById("dropzone-file")) {
    const fileInput = document.getElementById("dropzone-file");
    if (fileInput) {
      fileInput.addEventListener("change", handleFileChange);
    }
  }
});

const emit = defineEmits(["image-changed"]);

const imagePreviews = ref([]);
const fileInput = ref(null);

const props = defineProps({
  name: {
    type: String,
    default: "images",
  },
  isVideo: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isMultiple: {
    type: Boolean,
    default: false,
  },
});

const handleFileChange = (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  // Reset previous previews
  imagePreviews.value = [];

  if (props.isVideo) {
    videoFileName.value = files[0].name;
  } else {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const reader = new FileReader();
      reader.onload = () => {
        imagePreviews.value.push(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  emit("image-changed", event);
};

// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   if (file) {
//     if (
//       ![
//         "image/jpeg",
//         "image/png",
//         "image/gif",
//         "image/svg+xml",
//         "image/webp",
//       ].includes(file.type)
//     ) {
//       toast.error("Invalid file type. Please upload a valid image.");
//       return;
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       toast.error("File is too large. Maximum size is 2MB.");
//       return;
//     }

//     image.value.name = file.name;
//     image.value.type = file.type;

//     const reader = new FileReader();
//     reader.onload = () => {
//       try {
//         const base64String = reader.result.split(",")[1];
//         image.value.base64String = base64String;
//         toast.success("Image uploaded successfully!");
//       } catch (error) {
//         console.error("Error processing the image file:", error);
//         toast.error("Failed to process the image. Please try again.");
//       }
//     };
//     reader.readAsDataURL(file);
//     reader.onerror = (error) => {
//       console.error("Error reading the file:", error);
//       toast.error("Failed to read the image file. Please try again.");
//     };
//   }
//   emit("image-changed", event);
// };
</script>
<template>
  <div class="flex flex-col gap-1 items-center justify-center w-full">
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-25 border-2 border-gray-300 border-dashed rounded-full cursor-pointer bg-transparent hover:bg-slate-200 hover:backdrop:brightness-90"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p class="mb-2 text-sm text-gray-300 dark:text-gray-400">
          <span class="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p
          class="text-xs text-gray-500 dark:text-gray-400"
          v-if="isVideo == false"
        >
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400" v-else>
          WEBP, MP4 or MP3 (MAX. 10MB)
        </p>
      </div>
      <Field
        as="input"
        id="dropzone-file"
        ref="fileInput"
        type="file"
        :name="name"
        class="hidden"
        :multiple="isMultiple == true"
      />
    </label>
    <p class="mt-2 text-sm text-red-600 dark:text-red-500" v-if="errorMessage">
      <span class="font-medium">Oops! </span> {{ errorMessage }}
    </p>
    <div class="w-full mt-4 flex flex-wrap space-x-4">
      <!-- Display image previews -->
      <div v-for="(previewUrl, index) in imagePreviews" :key="index">
        <img
          :src="previewUrl"
          class="h-16 w-16 rounded-full object-cover"
          alt="Preview"
        />
      </div>
      <!-- Display video file name -->
      <div v-if="isVideo && videoFileName">{{ videoFileName }}</div>
    </div>
  </div>
</template>
