<script setup>
import { useToast } from "vue-toast-notification";
import { ref, onMounted } from "vue";

import { useRoute } from "vue-router";

const route = useRoute();
const toast = useToast();
const bookId = route.params.id;

const useBookStore = bookStore();
const isLoading = ref(false);
const bookDetails = ref(null);
const isVerifying = ref(false);

const fetchBookDetails = async () => {
  isLoading.value = true;

  try {
    await useBookStore.getBook(bookId);
    bookDetails.value = useBookStore.book;
    console.log("book details", JSON.stringify(bookDetails.value, null, 2));
  } catch (error) {
    toast.error("Failed to load book details");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};


const handleVerifyPayment = async (payment) => {
  if (!payment.id || !payment.tx_ref) {
    toast.error("Invalid payment details. Please try again.");
    console.error("Missing payment details:", payment);
    return;
  }

  isVerifying.value = true;
  try {
    console.log("Verifying payment with ID:", payment.id, "and tx_ref:", payment.tx_ref);

    const response = await useBookStore.verifyPayment({
      id: payment.id,
      tx_ref: payment.tx_ref,
    });
    console.log("Response from verifying payment:", response);
    console.log("useBookStore.verifyPayment:", useBookStore.verifyPayment);


    if (response) {
      toast.success("Payment verified successfully!");
      fetchBookDetails(); 
    } else {
      toast.error("Failed to verify payment");
    }
  } catch (error) {
    toast.error("Error verifying payment");
    console.error("Error verifying payment:", error);
  } finally {
    isVerifying.value = false;
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
          class="w-full md:w-1/3 h-auto object-cover rounded-lg border-2 border-gray-300 shadow-md shadow-gray-200 transform hover:scale-105 transition-transform duration-300"
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
            <h4 class="text-lg font-semibold text-gray-700">Payment details</h4>
            <ul class="mt-2 space-y-2">
              <li
                v-for="payment in bookDetails.rent_book.payments"
                :key="payment.id"
                class="bg-gray-50 border border-gray-200 rounded-lg p-4"
              >
                <p class="text-gray-600">
                  <strong>Payment status:</strong> {{ payment.status }}
                </p>
                <p class="text-gray-600">
                  <strong>Payment date:</strong>
                  {{ new Date(payment.created_at).toDateString() }}
                </p>
                <p class="text-gray-600">
                  <strong>Amount:</strong> {{ payment.amount }} Birr
                </p>
                <p class="text-gray-600">
                  <strong>TransactionId:</strong> {{ payment.tx_ref }}
                </p>
                <p class="text-gray-600">
                  <strong>Currency:</strong> {{ payment.currency }}
                </p>
                <p class="text-gray-600">
                  <strong>Payment Id:</strong> {{ payment.id }}
                </p>

                <!-- Verify Payment Button -->
                <button
                  v-if="payment.status === 'pending'"
                  @click="handleVerifyPayment(payment)"
                  class="mt-4 bg-cyan-500 hover:bg-cyab-600 text-white font-bold py-1 px-3 rounded-full transition"
                  :disabled="isVerifying"
                >
                  {{ isVerifying ? "Verifying..." : "Verify Payment" }}
                </button>
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
