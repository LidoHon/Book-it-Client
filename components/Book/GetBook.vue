<template>
  <div>
    <div class="w-1/2">
      <p>There are {{ data?.books?.length || 0 }} books.</p>
      <ul class="mt-4">
        <li
          v-for="(book, index) in data?.books"
          :key="index"
          class="mb-2 p-2 border rounded shadow"
        >
          <p><strong>Title:</strong> {{ book.title || "N/A" }}</p>
          <p><strong>Available:</strong> {{ book.available || "N/A" }}</p>
          <p><strong>Author:</strong> {{ book.author || "N/A" }}</p>
          <p><strong>Genre:</strong> {{ book.genre || "N/A" }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const query = gql`
  query getBooks {
    books {
      author
      available
      genre
      id
      title
    }
  }
`;

const { data } = await useAsyncQuery(query);
</script>
