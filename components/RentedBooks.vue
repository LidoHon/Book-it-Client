<script setup>
import { computed, onMounted } from "vue";

const useAuthStore = authStore();
const rentedBooks = computed(() => useAuthStore.rentedBooks);

onMounted(async () => {
  await useAuthStore.getProfile();
});


function returnBook(bookId) {
  useAuthStore.returnBook(bookId);
}
</script>

<template>
  <div class="mt-8">
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-lg font-bold mb-4">Rented Books</h2>
      <ul>
        <li
          v-for="book in rentedBooks"
          :key="book.id"
          class="border-b py-2 flex justify-between items-center"
        >
          <div>
            <h3 class="text-md font-semibold">{{ book.book.title }}</h3>
            <p class="text-sm text-gray-600">Author: {{ book.book.author }}</p>
            <p class="text-sm text-gray-600">Genre: {{ book.book.genre }}</p>
            <p class="text-sm text-gray-600">
              Rent Day: {{ new Date(book.rent_day).toLocaleDateString() }}
            </p>
            <p class="text-sm text-gray-600">
              Available: {{ book.book.available ? "Yes" : "No" }}
            </p>
          </div>
          <button
            class="text-sm text-red-500 hover:underline"
            @click="returnBook(book.id)"
          >
            Return
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
