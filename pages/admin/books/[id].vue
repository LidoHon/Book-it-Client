<script setup>
import { useToast } from "vue-toast-notification";
import { ref, onMounted } from "vue";

const route = useRoute();
const toast = useToast();
const bookId = route.params.id;

const useBookStore = bookStore();
const isLoading = ref(false);
const bookDetails = ref(null);

const fetchBookDetails = async () => {
  isLoading.value = true;

  try {
    await useBookStore.getBook(bookId);
    bookDetails.value = useBookStore.book;
    console.log("book details", bookDetails.value);
  } catch (error) {
    toast.error("Failed to load book details");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchBookDetails);
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
    <div v-if="isLoading" class="text-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div
      v-else-if="bookDetails"
      class="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full"
    >
      <h2 class="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Book Details
      </h2>
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Book Image -->
        <img
          :src="bookDetails.bookImage || 'https://via.placeholder.com/150'"
          :alt="bookDetails.title"
          class="w-full md:w-48 h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md shadow-gray-200 transform hover:scale-105 transition-transform duration-300"
        />
        <!-- Book Information -->
        <div class="flex-grow">
          <h3 class="text-xl font-semibold text-gray-700">
            {{ bookDetails.title }}
          </h3>
          <p class="text-gray-600 mt-2">
            <strong>Genre:</strong> {{ bookDetails.genre }}
          </p>
          <div class="mt-4">
            <span
              class="px-4 py-2 rounded-full text-sm font-medium"
              :class="
                bookDetails.available
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              "
            >
              {{ bookDetails.available ? "Available" : "Not Available" }}
            </span>
          </div>
          <p class="text-gray-500 mt-4">
            <strong> Added on:</strong>
            {{ new Date(bookDetails.created_at).toDateString() }}
          </p>
          <!-- Rent Information -->
          <div
            v-if="
              bookDetails.rent_book &&
              bookDetails.rent_book.user_rent.length > 0
            "
            class="mt-6"
          >
            <p class="text-gray-500">
              <strong>Rented Date:</strong>
              {{ new Date(bookDetails.rent_book.rent_day).toDateString() }}
            </p>

            <h4 class="text-lg font-semibold text-gray-700">Rented By:</h4>
            <ul class="mt-2 space-y-2">
              <li
                v-for="user in bookDetails.rent_book.user_rent"
                :key="user.email"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <p class="text-gray-600">
                  <strong>Username:</strong> {{ user.username }}
                </p>
                <p class="text-gray-600">
                  <strong>Phone:</strong> {{ user.phone }}
                </p>
                <p class="text-gray-600">
                  <strong>Email:</strong> {{ user.email }}
                </p>
              </li>
            </ul>
          </div>
          <div v-else class="mt-6">
            <p class="text-red-500 font-medium">This book is not rented yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
