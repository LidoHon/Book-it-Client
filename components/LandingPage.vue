<script setup>
import { onMounted, ref, computed } from "vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();

const usebookStore = bookStore();
const useAuthStore = authStore();

const searchQuery = ref("");
const rentedBooks = computed(() => usebookStore.rentedBooks);
const wishlistedBooks = computed(() => usebookStore.wishlistedBooks);

const fetchBooks = async () => {
  await usebookStore.getBooks(searchQuery.value);
};

const user_id = useAuthStore.user.id;
// const bookId = usebookStore.book.id;
const handleRent = async (book_id) => {
  usebookStore.isLoading = true;
  let payload;
  payload = {
    user_id,
    book_id,
  };
  const res = await usebookStore.rentBook(payload);
  console.log("response from renting book", res);
  if (res) {
    toast.success("Book rented successfully");
    await usebookStore.getBooks();
  } else {
    toast.error("Something went wrong! Please try again.");
  }
};

const handleWishlist = async (bookId) => {
  console.log("handleWishlist called with bookId:", bookId);
  usebookStore.isLoading = true;
  const payload = {
    userId: user_id,
    bookId,
  };

  try {
    const response = await usebookStore.addWishlist(payload);
    if (response) {
      toast.success("Book added to wishlist successfully");
      await usebookStore.getBooks();
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error adding book to wishlist:", error);
    toast.error("An error occurred. Please try again.");
  } finally {
    usebookStore.isLoading = false;
  }
};
const handleReturn = async (book_id) => {
  toast.success("we are working on that");
};

const handleRemoveWishlist = async (bookId) => {
  console.log("handleRemoveWishlist called with bookId:", bookId);
  try {
    const response = await usebookStore.removeWishlist(bookId);
    console.log("response from removing wishlist handler", response);
    if (response) {
      toast.success("Book removed from wishlist successfully");
      await usebookStore.getBooks();
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error removing book from wishlist:", error);
    toast.error("An error occurred. Please try again.");
  }
};
// Fetch books on component mount
onMounted(() => {
  fetchBooks();
  usebookStore.getRentedBooks();
  usebookStore.getWishlistedBooks();
});
</script>
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Books Section -->
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">Bookshelf</h2>
    <div v-if="usebookStore.isLoading" class="text-center text-lg">
      Loading...
    </div>
    <div v-else>
      <div v-if="usebookStore.books.length === 0" class="text-center text-lg">
        Sorry, no books found.
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 relative z-10"
      >
        <div
          v-for="book in usebookStore.books"
          :key="book.id"
          class="relative bg-white shadow-lg rounded-lg p-4 transform hover:scale-105 transition duration-300"
        >
          <img
            :src="book.bookImage || 'https://via.placeholder.com/150'"
            alt="Book Image"
            class="w-full h-48 object-cover rounded-md shadow-md mb-4"
          />
          <h3 class="font-semibold text-lg text-gray-700">{{ book.title }}</h3>
          <p class="text-sm text-gray-500">Author: {{ book.author }}</p>
          <p class="text-sm text-gray-500">Genre: {{ book.genre }}</p>
          <p class="text-sm text-gray-500">ID: {{ book.id }}</p>
          <p
            class="text-sm font-semibold mt-2"
            :class="book.available ? 'text-green-600' : 'text-red-600'"
          >
            {{ book.available ? "Available" : "Not Available" }}
          </p>
          <div class="mt-4 flex flex-col gap-2">
            <button
              @click="handleRent(book.id)"
              v-if="book.available"
              class="w-full bg-red-700 text-white font-bold py-2 rounded-lg hover:bg-red-800"
            >
              <span v-if="!usebookStore.$state.isLoading"> Rent </span>
              <div v-else class="flex items-center gap-2">
                <UILoading />
              </div>
            </button>
            <button
              v-else-if="
                rentedBooks.some(
                  (rentedBook) =>
                    rentedBook.bookId === book.id &&
                    rentedBook.userId === useAuthStore.user.id
                )
              "
              @click="handleReturn(book.id)"
              class="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
            >
              Return
            </button>
            <button
              @click="handleRemoveWishlist(book.id)"
              v-else-if="
                wishlistedBooks.some(
                  (wishlistedBook) =>
                    wishlistedBook.bookId === book.id &&
                    wishlistedBook.userId === useAuthStore.user.id
                )
              "
              class="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
            >
              Remove from Wishlist
            </button>
            <button
              @click="handleWishlist(book.id)"
              v-else
              class="w-full bg-[#748878] text-white font-bold py-2 rounded-lg hover:bg-[#3e4b40]"
            >
              add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
