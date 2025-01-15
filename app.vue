<script setup lang="ts">
useSeoMeta({
  title: "My booking app ",
  ogTitle: "My booking app",
  description: "This is my amazing site, let me tell you all about it.",
  ogDescription: "This is my amazing site, let me tell you all about it.",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <div data-theme="winter" class="min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
