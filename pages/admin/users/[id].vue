<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toast-notification";
import { userStore } from "~/stores/user";

const route = useRoute();
const toast = useToast();
const userId = parseInt(route.params.id);
const useUserStore = userStore();
const userDetails = ref(null);
const isLoading = ref(false);

// Fetch user details
const fetchUserDetails = async () => {
  isLoading.value = true;
  try {
    await useUserStore.getUser(userId);
    userDetails.value = useUserStore.user;
    console.log("user details", userDetails.value);
  } catch (error) {
    toast.error("Failed to load user details");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch data on component mount
onMounted(fetchUserDetails);
</script>

<template>
  <div
    class="p-6 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 min-h-screen"
  >
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-blue-500"></span>
    </div>

    <!-- User Details -->
    <div
      v-else-if="userDetails"
      class="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto"
    >
      <!-- User Basic Info -->
      <div class="flex flex-col md:flex-row items-center gap-6 mb-8">
        <img
          :src="userDetails.profile || '/img/user0.png'"
          alt="User Avatar"
          class="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-blue-500 shadow-md"
        />
        <div class="text-center md:text-left">
          <h1 class="text-3xl font-bold text-gray-800">
            {{ userDetails.username }}
          </h1>
          <p class="text-gray-600">{{ userDetails.email }}</p>
          <p class="text-gray-600">
            Phone: <span>{{ userDetails.phone || "N/A" }}</span>
          </p>
          <p
            :class="
              userDetails.is_email_verified ? 'text-green-500' : 'text-red-500'
            "
            class="font-semibold"
          >
            Email Verified: {{ userDetails.is_email_verified ? "Yes" : "No" }}
          </p>
          <p class="text-gray-600">
            Role: <span class="font-semibold">{{ userDetails.role }}</span>
          </p>
        </div>
      </div>

      <!-- Notifications -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-700 border-b pb-2">
          Notifications
        </h2>
        <ul v-if="userDetails.notifications?.length" class="mt-4 space-y-4">
          <li
            v-for="notification in userDetails.notifications"
            :key="notification.id"
            class="bg-blue-50 p-4 rounded-lg shadow-sm"
          >
            <p>{{ notification.message }}</p>
            <p class="text-sm text-gray-500 mt-2">
              {{ new Date(notification.created_at).toLocaleString() }}
            </p>
          </li>
        </ul>
        <p v-else class="text-gray-500 mt-4">No notifications found.</p>
      </div>

      <!-- Wishlists -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-700 border-b pb-2">
          Wishlists
        </h2>
        <ul v-if="userDetails.wishlists?.length" class="mt-4 space-y-6">
          <li
            v-for="wishlist in userDetails.wishlists"
            :key="wishlist.id"
            class="flex gap-6 items-center bg-white p-4 rounded-lg shadow-md"
          >
            <img
              :src="wishlist.book.bookImage"
              alt="Book Image"
              class="h-28 w-20 object-cover rounded-lg border-2 border-gray-300 shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            />
            <div>
              <p class="font-semibold text-gray-800">
                {{ wishlist.book.title }}
              </p>
              <p class="text-gray-600">Author: {{ wishlist.book.author }}</p>
              <p class="text-gray-600">Genre: {{ wishlist.book.genre }}</p>
              <p class="text-gray-600">
                Added on:
                {{ new Date(wishlist.created_at).toLocaleDateString() }}
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500 mt-4">No wishlists found.</p>
      </div>

      <!-- Rented Books -->
      <div>
        <h2 class="text-2xl font-bold text-gray-700 border-b pb-2">
          Rented Books
        </h2>
        <ul v-if="userDetails.RentedBooks?.length" class="mt-4 space-y-6">
          <li
            v-for="rentedBook in userDetails.RentedBooks"
            :key="rentedBook.id"
            class="flex gap-6 items-center bg-white p-4 rounded-lg shadow-md"
          >
            <img
              :src="rentedBook.book.bookImage"
              alt="Book Image"
              class="h-28 w-20 object-cover rounded-lg border-2 border-gray-300 shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
            />
            <div>
              <p class="font-semibold text-gray-800">
                {{ rentedBook.book.title }}
              </p>
              <p class="text-gray-600">Author: {{ rentedBook.book.author }}</p>
              <p class="text-gray-600">
                Rented on:
                {{ new Date(rentedBook.rent_day).toLocaleDateString() }}
              </p>
              <p class="text-gray-600">
                Return Date:
                {{
                  rentedBook.return_date
                    ? new Date(rentedBook.return_date).toLocaleDateString()
                    : "Not Returned"
                }}
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500 mt-4">No rented books found.</p>
      </div>
    </div>

    <!-- No User Details -->
    <div v-else class="text-center text-gray-500">
      <p>No user details found.</p>
    </div>
  </div>
</template>
