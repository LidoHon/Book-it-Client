<script setup>
import { computed, onMounted } from "vue";
import { useToast } from "vue-toast-notification";
const useAuthStore = authStore();
const rentedBooks = computed(() => useAuthStore.rentedBooks);
const toast = useToast();
onMounted(async () => {
  await useAuthStore.getProfile();
});

const usebookStore = bookStore();

const handleReturn = async (bookId) => {
  console.log("handleReturn called with bookId:", bookId);
  try {
    const res = await usebookStore.returnBook(bookId);
    if (res) {
      toast.success("Book returned successfully");
      await usebookStore.getBooks();
    } else {
      toast.error("Something went wrong! Please try again.");
    }
  } catch (error) {
    console.error("Error returning book:", error);
    toast.error("An error occurred. Please try again.");
  }
};
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
              <p class="text-sm text-gray-600">Genre: {{ book.book.genre }}</p>
              <p class="text-sm text-gray-600">
                Rent Day: {{ new Date(book.rent_day).toLocaleDateString() }}
              </p>
              <p class="text-sm text-gray-600">
                Available: {{ book.book.available ? "Yes" : "No" }}
              </p>
            </div>
          </div>
          <button
            class="text-sm text-red-500 hover:underline"
            @click="handleReturn(book.id)"
          >
            Return
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
