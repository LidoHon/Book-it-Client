<script setup>
import { onMounted, ref, computed } from "vue";
import { bookStore } from "~/stores/book";

const usebookStore = bookStore();
const searchQuery = ref("");

const rentedBooks = computed(() => usebookStore.rentedBooks);
const wishlistedBooks = computed(() => usebookStore.wishlistedBooks);
console.log("rented boooooks", rentedBooks);
const useAuthStore = authStore();
const fetchBooks = async () => {
  await usebookStore.getBooks(searchQuery.value);
};

// Fetch books on component mount
onMounted(() => {
  fetchBooks();
  usebookStore.getRentedBooks();
  usebookStore.getWishlistedBooks();
});
</script>

<template>
  <div>
    <!-- Books Section -->
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Books</h2>
      <div v-if="usebookStore.isLoading" class="text-center text-lg">
        Loading...
      </div>
      <div v-else>
        <div v-if="usebookStore.books.length === 0" class="text-center text-lg">
          sorry, No books found.
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="book in usebookStore.books"
            :key="book.id"
            class="card shadow-lg"
          >
            <figure>
              <img
                :src="book.bookImage || 'https://via.placeholder.com/150'"
                alt="Book Image"
                class="w-full h-48 object-cover"
              />
            </figure>
            <div class="card-body">
              <h3 class="card-title">{{ book.title }}</h3>
              <p class="text-sm text-gray-500">Author: {{ book.author }}</p>
              <p class="text-sm text-gray-500">Genre: {{ book.genre }}</p>
              <p
                class="text-sm"
                :class="book.available ? 'text-green-500' : 'text-red-500'"
              >
                {{ book.available ? "Available" : "Not Available" }}
              </p>
              <div v-if="book.available" class="flex justify-between">
                <button
                  class="rounded-full pl-10 pr-10 pt-2 pb-2 text-center bg-red-700 text-white text-s font-bold"
                >
                  rent
                </button>
                <div>
                  <button
                    v-if="
                      wishlistedBooks.some(
                        (wishlistedBook) =>
                          wishlistedBook.bookId === book.id &&
                          wishlistedBook.userId === useAuthStore.user.id
                      )
                    "
                    class="rounded-full pl-6 pr-6 pt-2 pb-2 text-center bg-red-600 text-white text-s font-bold"
                  >
                    remove from wishlist
                  </button>
                  <button
                    v-else
                    class="rounded-full pl-6 pr-6 pt-2 pb-2 text-center bg-[#748878] text-white text-s font-bold"
                  >
                    + Wishlist
                  </button>
                </div>
              </div>
              <div v-else class="flex justify-center">
                <!-- Loop through rentedBooks to check if the current book is rented by the logged-in user -->
                <div v-for="rentedBook in rentedBooks" :key="rentedBook.id">
                  <div
                    v-if="
                      rentedBook.bookId === book.id &&
                      rentedBook.userId === useAuthStore.user.id
                    "
                  >
                    <!-- Show Return button if the logged-in user rented the book -->
                    <button
                      class="rounded-full pl-6 pr-6 pt-2 pb-2 text-center bg-red-700 text-white text-s font-bold"
                    >
                      Return
                    </button>
                  </div>
                </div>

                <!-- Show Wishlist button only if the logged-in user has not rented the book -->
                <div
                  v-if="
                    !rentedBooks.some(
                      (rentedBook) =>
                        rentedBook.bookId === book.id &&
                        rentedBook.userId === useAuthStore.user.id
                    )
                  "
                >
                  <button
                    v-if="
                      wishlistedBooks.some(
                        (wishlistedBook) =>
                          wishlistedBook.bookId === book.id &&
                          wishlistedBook.userId === useAuthStore.user.id
                      )
                    "
                    class="rounded-full pl-6 pr-6 pt-2 pb-2 text-center bg-red-600 text-white text-s font-bold"
                  >
                    Remove from Wishlist
                  </button>
                  <button
                    v-else
                    class="rounded-full pl-6 pr-6 pt-2 pb-2 text-center bg-[#748878] text-white text-s font-bold"
                  >
                    + Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
