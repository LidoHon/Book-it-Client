<script setup>
const route = useRoute();
const bookId = route.params.id;
</script>

<template>
  <div>this is page for book id : {{ bookId }}</div>
</template>
