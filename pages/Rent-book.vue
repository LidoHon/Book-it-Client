<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const useBookStore = bookStore();
const useAuthStore = authStore();

const book_id = route.query.bookId;
const book = ref(null);
const rentDate = ref(new Date().toISOString().split("T")[0]);
const returnDate = ref("");
const price = computed(() => {
  if (!returnDate.value) return 0;
  const rentDay = new Date(rentDate.value);
  const returnDay = new Date(returnDate.value);
  const days = Math.ceil((returnDay - rentDay) / (1000 * 60 * 60 * 24));
  return days * 1;
});

// Fetch book details
onMounted(async () => {
  await useBookStore.getBook(book_id);
  book.value = useBookStore.book;
});

// Rent the book (Confirm Rent)
const confirmRent = async () => {
  if (!returnDate.value) {
    toast.error("Please select a return date");
    return;
  }

  const payload = {
    user_id: useAuthStore.user.id,
    book_id: parseInt(book_id),
    rent_date: rentDate.value,
    return_date: returnDate.value,
    price: price.value,
  };
  console.log("payload from renting a book", JSON.stringify(payload, 2, null));
  // Rent the book and store the checkout URL
  const rentSuccess = await useBookStore.rentBook(payload);
  if (rentSuccess) {
    toast.success("Book rented successfully. You can now proceed to payment.");
  } else {
    toast.error("Failed to rent the book");
  }
};

const id = Number(useBookStore.$state.paymentId);
console.log("the payment id in checkout", id);
// console.log("paymentid", paymentId);
// Redirect to Chapa payment page
const payWithChapa = async () => {
  const id = Number(
    useBookStore.$state.paymentId?.id || useBookStore.$state.paymentId
  );
  console.log("Type of paymentId:", typeof id, id);
  // const numericId = Number(id);
  console.log("Final paymentId before request:", id, "Type:", typeof id);

  if (!id || isNaN(id)) {
    toast.error("Invalid payment ID!");
    return;
  }

  if (!id) {
    toast.error("Payment ID is missing!");
    return;
  }
  console.log("Type of numeric paymentId:", typeof id, id);
  // Fetch the checkout URL using paymentId
  await useBookStore.getCheckOutUrl(id);
  const checkout_url = useBookStore.$state.checkoutUrl;

  console.log("Checkout URL:", checkout_url);

  if (checkout_url) {
    window.location.href = checkout_url; // Redirect user to Chapa
  } else {
    toast.error("Unable to fetch payment URL");
  }
};

// Function to fetch Chapa checkout URL
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">Rent Book</h2>

    <div v-if="!book" class="text-center">Loading...</div>
    <div v-else class="bg-white shadow-lg rounded-lg p-6">
      <img
        :src="book.bookImage"
        alt="Book Image"
        class="w-full h-64 object-cover rounded-md mb-4"
      />
      <h3 class="text-xl font-semibold">{{ book.title }}</h3>
      <p class="text-gray-600">Author: {{ book.author }}</p>
      <p class="text-gray-600">Genre: {{ book.genre }}</p>

      <div class="mt-4">
        <label class="block font-semibold">Return Date:</label>
        <input
          v-model="returnDate"
          type="date"
          class="border p-2 rounded w-full"
        />
      </div>

      <p class="mt-2 text-lg font-semibold">Total Price: {{ price }} Birr</p>

      <!-- Confirm Rent Button -->
      <button
        @click="confirmRent"
        class="mt-4 w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700"
      >
        Confirm Rent
      </button>

      <!-- Pay with Chapa Button (only visible after confirming rent) -->
      <button
        v-if="book"
        @click="payWithChapa"
        class="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
      >
        Pay with Chapa
      </button>
    </div>
  </div>
</template>
