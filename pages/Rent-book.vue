<script setup>
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import { useRoute, useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const useAuthStore = authStore();
const useBookStore = bookStore();
const user = ref({
  name: "John Doe", // Replace with actual user data
  email: "johndoe@example.com",
});



const returnDate = ref("");
const price = ref(0);

const calculatePrice = () => {
  const currentDate = new Date();
  const selectedDate = new Date(returnDate.value);

  const diffTime = selectedDate - currentDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  price.value = diffDays > 0 ? diffDays * 1 : 0; // $1 per day
};

const handleRentBook = async () => {
  toast.success("Book rented successfully!");
  router.push("/dashboard"); // Redirect to the dashboard or another page
};

const initiateChapaPayment = () => {
  const chapaPayment = new ChapaCheckout({
    public_key: "CHAPUBK_TEST-rcKvlUgGJuAxncoaEVOR18bYtJIo5ocG", 
    amount: price.value * 100, // Amount in cents
    email: user.value.email,
    currency: "ETB",
    callback_url: "http://localhost:5000/api/rent/callback",
    // cancel_url: "https://yourwebsite.com/payment-cancel",
    metadata: {
      user_id: "user_id_here", // Replace with actual user ID
      book_title: book.value.title,
      return_date: returnDate.value,
    },
  });

  chapaPayment.open();
};

const cancelRent = () => {
  router.push("/dashboard"); // Redirect to dashboard or home page
};
</script>
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-8">
    <!-- Page Header -->
    <h1 class="text-3xl font-bold mb-6">Rent Book</h1>

    <!-- Book and User Info Card -->
    <div class="bg-white shadow-md rounded-lg p-6 w-3/4">
      <div class="flex justify-between items-center mb-4">
        <!-- User Info -->
        <div>
          <h2 class="text-xl font-semibold">User Information</h2>
          <p><strong>Name:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>

        <!-- Book Info -->
        <div>
          <h2 class="text-xl font-semibold">Book Information</h2>
          <p><strong>Title:</strong> {{ book.title }}</p>
          <p><strong>Author:</strong> {{ book.author }}</p>
        </div>
      </div>

      <!-- Return Date and Price -->
      <div class="mt-4">
        <label
          for="returnDate"
          class="block text-sm font-medium text-gray-700 mb-2"
        >
          Select Return Date
        </label>
        <input
          type="date"
          id="returnDate"
          v-model="returnDate"
          class="border p-2 rounded w-full"
          @change="calculatePrice"
        />

        <div class="mt-4">
          <p class="text-lg">
            <strong>Price:</strong>
            <span class="text-green-600">{{
              price > 0 ? `$${price}` : "Select a valid return date"
            }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Messages and Actions -->
    <div class="bg-white shadow-md rounded-lg p-6 w-3/4 mt-6">
      <p class="text-center text-lg mb-4">
        Enjoy your book! Remember to return it on time to avoid additional
        charges.
      </p>
      <div class="flex justify-center space-x-4">
        <button
          class="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          @click="cancelRent"
        >
          Cancel
        </button>
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded"
          :disabled="price <= 0"
          @click="handleRentBook"
        >
          Rent Book
        </button>
        <button
          v-if="price > 0"
          class="bg-green-600 text-white px-4 py-2 rounded"
          @click="initiateChapaPayment"
        >
          Pay with Chapa
        </button>
      </div>
    </div>
  </div>
</template>
