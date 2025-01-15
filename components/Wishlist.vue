<script setup>
import { computed, onMounted } from "vue";

const useAuthStore = authStore();
const wishlists = computed(() => useAuthStore.wishlists);
console.log("wishlists books", wishlists);

onMounted(async () => {
  await useAuthStore.getProfile();
});

function removeFromWishlist(bookId) {
  useAuthStore.removeFromWishlist(bookId);
}
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
          <div>
            <h3 class="text-md font-semibold">{{ book.book.title }}</h3>
            <p class="text-sm text-gray-600">Author: {{book.book.author }}</p>
            <p class="text-sm text-gray-600">Genre: {{ book.book.genre }}</p>
            <p class="text-sm text-gray-600">
              Available: {{ book.book.available ? "Yes" : "No" }}
            </p>
          </div>
          <button
            class="text-sm text-red-500 hover:underline"
            @click="removeFromWishlist(book.bookId)"
          >
            Remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
