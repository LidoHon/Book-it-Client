<script setup>
import { computed, onMounted } from "vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const usebookStore = bookStore();
const useAuthStore = authStore();
const wishlists = computed(() => useAuthStore.wishlists);

onMounted(async () => {
  await useAuthStore.getProfile();
});

const handleRemoveWishlist = async (bookId) => {
  console.log("handleRemoveWishlist called with bookId:", bookId);
  try {
    const response = await usebookStore.removeWishlist(bookId);
    console.log("response from removing wishlist handler", response);
    if (response) {
      toast.success("Book removed from wishlist successfully");

      // Refetch the updated wishlist
      useAuthStore.wishlists = useAuthStore.wishlists.filter(
        (item) => item.book.id !== bookId
      );
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error removing book from wishlist:", error);
    toast.error("An error occurred. Please try again.");
  }
};
</script>

<template>
  <div class="mt-8">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-bold mb-4">Wishlisted Books</h2>
      <ul>
        <li
          v-for="book in wishlists"
          :key="book.id"
          class="border-b py-2 flex justify-between items-center"
        >
          <div class="flex flex-row gap-10">
            <div>
              <img
                :src="book.book.bookImage"
                alt="Book Image"
                class="h-28 w-20 object-cover rounded-lg border-2 border-gray-300 shadow-xl shadow-cyan-500/50 transform hover:scale-105 hover:rotate-1 transition duration-300 ease-in-out"
              />
            </div>
            <div>
              <h3 class="text-md font-semibold">{{ book.book.title }}</h3>
              <p class="text-sm text-gray-600">
                Author: {{ book.book.author }}
              </p>
              <p class="text-sm text-gray-600">Id: {{ book.book.id }}</p>
              <p class="text-sm text-gray-600">Genre: {{ book.book.genre }}</p>
              <p class="text-sm text-gray-600">
                Available: {{ book.book.available ? "Yes" : "No" }}
              </p>
            </div>
          </div>
          <button
            class="text-sm text-red-500 hover:underline"
            @click="handleRemoveWishlist(book.book.id)"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
