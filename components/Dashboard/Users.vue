<script setup>
import { userStore } from "~/stores/user";
import { useToast } from "vue-toast-notification";
import DELETE_USER from "~/graphql/mutation/deleteUser.gql";
import GET_USERS from "../../../graphql/query/users.gql";
import { ref, computed, onMounted } from "vue";
import { useMutation } from "@vue/apollo-composable";

const useUserStore = userStore();
const toast = useToast();
const emit = defineEmits(["refetch-deleted-users"]);
const currentPage = ref(1);
const itemsPerPage = 5;
const userToDelete = ref(null);
const showDeleteConfirmation = ref(false);
// Fetch users on mount
onMounted(async () => {
  try {
    await useUserStore.getUsers();
  } catch (error) {
    toast.error("Failed to load users");
    console.error("Failed to load users", error);
  }
});

// Function to handle delete user
const confirmDeleteUser = (user) => {
  userToDelete.value = user;
  showDeleteConfirmation.value = true; 
};

// Function to delete a user
const handleDeleteUser = async (userId) => {
  console.log("Deleting user with ID:", userId);
  try {
    const success = await useUserStore.deleteUser(userId);
    if (success) {
      toast.success("user deleted successfully!");
      showDeleteConfirmation.value = false;
      userToDelete.value = null;
      await useUserStore.getUsers();
    } else {
      toast.error("Failed to delete user");
    }
  } catch (err) {
    toast.error("Failed to delete user");
    console.error(err);
  }
};

// Pagination logic
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return useUserStore.users.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(useUserStore.users.length / itemsPerPage)
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
  <div class="p-6 bg-gray-100 mb-20">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold text-gray-700 mb-4">Users</h1>
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
              <th class="py-3 px-6 text-left">Name</th>
              <th class="py-3 px-6 text-left">Phone</th>
              <th class="py-3 px-6 text-left">Role</th>
              <th class="py-3 px-6 text-left">isVerified</th>
              <th class="py-3 px-6 text-left">Joined-in</th>
              <th class="py-3 px-10 text-start">Actions</th>
            </tr>
          </thead>
          <!-- Table Body -->
          <tbody class="text-gray-700 text-sm font-light">
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              class="border-b border-gray-200 hover:bg-gray-100"
            >
              <td class="py-3 px-6 text-left">
                <label>
                  <input type="checkbox" class="checkbox" />
                </label>
              </td>
              <td class="py-3 px-6 text-left">
                <div>
                  {{ user.id }}
                </div>
              </td>
              <td class="py-3 px-6">
                <div class="flex items-center gap-3">
                  <div class="avatar">
                    <div class="mask mask-squircle h-12 w-12">
                      <img
                        :src="user.profile || '/img/user0.png'"
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ user.username }}</div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-6">{{ user.phone || "N/A" }}</td>
              <td class="py-3 px-6">{{ user.role || "N/A" }}</td>
              <td class="py-3 px-6 font-bold">
                <span
                  :class="
                    user.is_email_verified
                      ? 'text-green-500 bg-green-100 px-4 py-1 rounded-lg text-xs '
                      : 'text-red-500 bg-red-100  px-4 py-1 rounded-lg text-xs'
                  "
                >
                  {{ user.is_email_verified ? "True" : "False" }}
                </span>
              </td>

              <td class="py-3 px-6">
                <span
                  class="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg text-xs"
                >
                  {{
                    user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"
                  }}
                </span>
              </td>
              <td class="py-3 px-6 text-center">
                <!-- Action Buttons -->
                <div class="flex gap-2">
                  <NuxtLink
                    :to="`/admin/users/${user.id}`"
                    class="btn btn-info btn-xs"
                  >
                    Details
                  </NuxtLink>
                  <!-- <button class="btn btn-warning btn-xs">Update</button> -->
                  <button
                    class="btn btn-error btn-xs"
                    @click="confirmDeleteUser(user)"
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
            Are you sure you want to delete the user
            <strong>{{ userToDelete?.username }}</strong
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
              @click="handleDeleteUser(userToDelete?.id)"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
