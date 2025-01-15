<script setup>
import { computed, ref, onMounted } from "vue";

const loading = ref(true);
onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1500);
});

const useAuthStore = authStore();
const authedUser = computed(() => useAuthStore.isAuthed);
</script>

<template>
  <div data-theme="winter">
    <div v-if="loading">
      <skeleton />
    </div>
    <!-- Render AuthPage if user is not authenticated -->
    <div v-else-if="!authedUser">
      <AuthPage />
    </div>
    <!-- Render LandingPage if user is authenticated -->
    <div v-else>
      <LandingPage />
    </div>
  </div>
</template>
