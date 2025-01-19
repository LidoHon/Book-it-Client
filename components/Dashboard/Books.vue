<script setup>
import { bookStore } from "~/stores/book";
import { useToast } from "vue-toast-notification";
import { ref, computed, onMounted } from "vue";

const useBookStore = bookStore();
const toast = useToast();
const emit = defineEmits(["refetch-deleted-books"]);
const currentPage = ref(1);
const itemsPerPage = 5;
const bookToDelete = ref(null);
const showDeleteConfirmation = ref(false);

// Fetch books on mount
onMounted(async () => {
  try {
    await useBookStore.getBooks();
  } catch (error) {
    toast.error("Failed to load books");
    console.error("Failed to load books", error);
  }
});

// Function to handle delete book
const confirmDeleteBook = (book) => {
  console.log("Book to delete:", JSON.stringify(book, null, 2));
  bookToDelete.value = book;
  showDeleteConfirmation.value = true;
};

// Function to delete a book
const handleDeleteBook = async (bookId) => {
  console.log("Book ID being sent to mutation:", bookId);
  try {
    const success = await useBookStore.deleteBook(bookId);
    if (success) {
      toast.success("Book deleted successfully!");
      showDeleteConfirmation.value = false;
      bookToDelete.value = null;
      await useBookStore.getBooks();
    } else {
      toast.error("Failed to delete book");
    }
  } catch (err) {
    toast.error("Failed to delete book");
    console.error(err);
  }
};

// Pagination logic
const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return useBookStore.books.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(useBookStore.books.length / itemsPerPage)
);

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<template>
  <div class="p-6 bg-gray-100 mb-10">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-700 mb-4">Books</h1>
      <div class="overflow-x-auto">
        <table class="table-auto w-full border-collapse border border-gray-300">
          <!-- Table Head -->
          <thead
            class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal"
          >
            <tr>
              <th class="py-3 px-6 text-left">
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </th>
              <th class="py-3 px-6 text-left">Id</th>
              <th class="py-3 px-6 text-left">Title</th>
              <th class="py-3 px-6 text-left">Author</th>
              <th class="py-3 px-6 text-left">Available</th>
              <th class="py-3 px-6 text-left">Added at</th>
              <th class="py-3 px-10 text-start">Actions</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="text-gray-700 text-sm font-light">
            <tr
              v-for="book in paginatedBooks"
              :key="book.id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left">
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </td>
              <td class="py-3 px-6 text-left">
                <div>
                  {{ book.id }}
                </div>
              </td>
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle h-12 w-12">
                      <img
                        :src="book.bookImage || '/img/default-book.png'"
                        alt="Book Cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ book.title }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-6">{{ book.author || "N/A" }}</td>
              <td class="py-3 px-6 font-bold">
                <span
                  :class="
                    book.available
                      ? 'text-green-500 bg-green-100 px-4 py-1 rounded-lg text-xs '
                      : 'text-red-500 bg-red-100  px-4 py-1 rounded-lg text-xs'
                  "
                >
                  {{ book.available ? "True" : "False" }}
                </span>
              </td>
              <td class="py-3 px-6">
                <span
                  class="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs"
                >
                  {{
                    book.created_at
                      ? new Date(book.created_at).toLocaleDateString()
                      : "N/A"
                  }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <!-- Action Buttons -->
                <div class="flex gap-2">
                  <NuxtLink
                    :to="`/admin/books/${book.id}`"
                    class="btn btn-info btn-xs"
                  >
                    Details
                  </NuxtLink>
                  <NuxtLink
                    :to="`/admin/books/${book.id}`"
                    class="btn btn-warning btn-xs"
                  >
                    update
                  </NuxtLink>
                  <button
                    class="btn btn-error btn-xs"
                    @click="confirmDeleteBook(book)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination -->
      <div class="flex justify-between items-center mt-4">
        <button
          class="btn btn-sm btn-primary"
          @click="prevPage"
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          class="btn btn-sm btn-primary"
          @click="nextPage"
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
      <!-- Confirmation Modal -->
      <div
        v-if="showDeleteConfirmation"
        class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div class="bg-white rounded-xl shadow-lg p-4 w-70">
          <h2 class="text-lg font-bold text-gray-700 mb-4">Confirm Deletion</h2>
          <p class="text-sm text-gray-600 mb-6">
            Are you sure you want to delete the book
            <strong>{{ bookToDelete?.title }}</strong
            >?
          </p>
          <div class="flex justify-end gap-4">
            <button
              class="btn btn-secondary"
              @click="showDeleteConfirmation = false"
            >
              Cancel
            </button>
            <button
              class="btn btn-error"
              @click="handleDeleteBook(bookToDelete?.id)"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
