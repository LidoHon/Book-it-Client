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
  <div class="p-6 bg-gray-100 min-h-screen">
    <div v-if="isLoading" class="text-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="userDetails" class="bg-white shadow-md rounded-lg p-6">
      <!-- User Basic Info -->
      <div class="flex items-center gap-6 mb-6">
        <img
          :src="userDetails.profile || '/img/user0.png'"
          alt="User Avatar"
          class="h-20 w-20 rounded-full border"
        />
        <div>
          <h1 class="text-2xl font-bold text-gray-700">
            {{ userDetails.username }}
          </h1>
          <p class="text-gray-500">{{ userDetails.email }}</p>
          <p class="text-gray-500">Phone: {{ userDetails.phone || "N/A" }}</p>
          <p
            :class="
              userDetails.is_email_verified ? 'text-green-500' : 'text-red-500'
            "
          >
            Email Verified: {{ userDetails.is_email_verified ? "Yes" : "No" }}
          </p>
          <p class="text-gray-500">
            Role: <span class="font-semibold">{{ userDetails.role }}</span>
          </p>
        </div>
      </div>

      <!-- Notifications -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-700">Notifications</h2>
        <ul v-if="userDetails.notifications?.length" class="mt-4">
          <li
            v-for="notification in userDetails.notifications"
            :key="notification.id"
            class="border-b py-2"
          >
            <p>{{ notification.message }}</p>
            <p class="text-sm text-gray-500">
              {{ new Date(notification.created_at).toLocaleString() }}
            </p>
          </li>
        </ul>
        <p v-else class="text-gray-500">No notifications found.</p>
      </div>

      <!-- Wishlists -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-700">Wishlists</h2>
        <ul v-if="userDetails.wishlists?.length" class="mt-4">
          <li
            v-for="wishlist in userDetails.wishlists"
            :key="wishlist.id"
            class="border-b py-2 flex items-center gap-4"
          >
            <img
              :src="wishlist.book.bookImage"
              alt="Book Image"
              class="h-12 w-12 object-cover rounded"
            />
            <div>
              <p class="font-semibold">{{ wishlist.book.author }}</p>
              <p class="text-gray-500">Genre: {{ wishlist.book.genre }}</p>
              <p class="text-gray-500">
                Added on:
                {{ new Date(wishlist.created_at).toLocaleDateString() }}
              </p>
            </div>
          </li>
        </ul>
        <p v-else class="text-gray-500">No wishlists found.</p>
      </div>

      <!-- Rented Books -->
      <div>
        <h2 class="text-xl font-bold text-gray-700">Rented Books</h2>
        <ul v-if="userDetails.RentedBooks?.length" class="mt-4">
          <li
            v-for="rentedBook in userDetails.RentedBooks"
            :key="rentedBook.id"
            class="border-b py-2 flex items-center gap-4"
          >
            <img
              :src="rentedBook.book.bookImage"
              alt="Book Image"
              class="h-12 w-12 object-cover rounded"
            />
            <div>
              <p class="font-semibold">{{ rentedBook.book.title }}</p>
              <p class="text-gray-500">Author: {{ rentedBook.book.author }}</p>
              <p class="text-gray-500">
                Rented on:
                {{ new Date(rentedBook.rent_day).toLocaleDateString() }}
              </p>
              <p class="text-gray-500">
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
        <p v-else class="text-gray-500">No rented books found.</p>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">
      <p>No user details found.</p>
    </div>
  </div>
</template>
