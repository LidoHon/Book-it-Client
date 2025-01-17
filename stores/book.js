import { acceptHMRUpdate, defineStore } from "pinia";
import Books_QUERY from "../graphql/query/books.gql";
import Rented_Books_QUERY from "../graphql/query/rentedBooks.gql";
import WISHLISTED_BOOKS_QUERY from "../graphql/query/wishlistedBooks.gql";
import INSERT_BOOK_MUTATION from "../graphql/mutation/addBook.gql";
export const bookStore = defineStore({
  id: "books",

  state: () => ({
    books: [],
    book: [],
    rentedBooks: [],
    wishlistedBooks: [],
    limit: 10,
    isLoading: false,
    isRented: false,
    isWishlisted: false,
    isDeleted: false,
    isUpdated: false,
    isAdded: false,
    processResultStatus: false,
    errorMessages: "",
    successMessage: "",
    offset: 0,
    currentPage: 1,
    totalBooks: 0,
    searchController: "%%",
  }),
  actions: {
    setSearchController(payload) {
      this.searchController = payload;
    },

    setOffset(payload) {
      this.offset = payload;
    },

    setLimit(payload) {
      if (payload < 1) {
        this.currentPage = 1;
      } else {
        this.currentPage = payload;
      }
      this.offset = (this.currentPage - 1) * this.limit;
    },

    setErrorMessage(payload) {
      this.errorMessages = payload;
    },
    setSucessMessage(payload) {
      this.successMessage = payload;
    },
    removeTheCurrentBook(payload) {
      this.books = this.book.filter((book) => book.id !== payload);
    },

    async getBooks(payload = "") {
      this.isLoading = true;
      const q = "%" + payload + "%";
      const { $apollo } = useNuxtApp();
      try {
        const res = await $apollo.clients.default.query({
          query: Books_QUERY,
          variables: {
            q,
            limit: this.limit,
            offset: this.offset,
          },
        });
        console.log("books result", JSON.stringify(res, null, 2));
        this.books = res.data.books;
        this.totalBooks = res.data.books_aggregate.aggregate.count;
      } catch (error) {
        console.log("error loading books", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getRentedBooks(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();

      try {
        const res = await $apollo.clients.default.query({
          query: Rented_Books_QUERY,
        });
        console.log("rented books result", res);
        this.rentedBooks = res.data.rentedBooks;
      } catch (error) {
        console.log("error loading rented books", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getWishlistedBooks(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();

      try {
        const res = await $apollo.clients.default.query({
          query: WISHLISTED_BOOKS_QUERY,
        });
        console.log("wishlisted books list", res);
        this.wishlistedBooks = res.data.wishlist;
      } catch (error) {
        console.log("error loading wishlisted books", error);
      } finally {
        this.isLoading = false;
      }
    },

    async insertBook(payload) {
      const {
        title,
        author,
        genre,
        available,
        imageName,
        imageType,
        imageString,
      } = payload;

      const { $apollo } = useNuxtApp();

      try {
        this.isLoading = true;
        let variables;

        if (imageName || imageType || imageString) {
          variables = {
            title,
            available,
            author,
            genre,
            base64String: imageString,
            type: imageType,
            name: imageName,
          };
        } else {
          variables = {
            title,
            available,
            author,
            genre,
          };
        }

        const res = await $apollo.clients.default.mutate({
          mutation: INSERT_BOOK_MUTATION,
          variables,
        });
        console.log("inserted book datttttta:", JSON.stringify(res, null, 2));

        if (res.data) {
          const data = res.data.addBook;
          console.log("the added book data", data);
          this.book = data;
          this.isAdded = true;
          this.processResultStatus = true;
        } else {
          this.errorMessages = res.errors[0].message;
          this.processResultStatus = false;
        }
      } catch (error) {
        console.log("insert book error", error);
        if (error.message) {
          this.setErrorMessage(error.message);
        }
        this.processResultStatus = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },
  },
});
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(bookStore, import.meta.hot));
}
