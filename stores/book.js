import { acceptHMRUpdate, defineStore } from "pinia";
import BOOKS_QUERY from "../graphql/query/books.gql";
import RENTED_BOOKS_QUERY from "../graphql/query/rentedBooks.gql";
import WISHLISTED_BOOKS_QUERY from "../graphql/query/wishlistedBooks.gql";
import INSERT_BOOK_MUTATION from "../graphql/mutation/addBook.gql";
import DELETE_BOOK from "../graphql/mutation/deleteBook.gql";
import QUERY_BOOK from "../graphql/query/book.gql";
import UPDATE_BOOK from "../graphql/mutation/updateBook.gql";
import RENT_BOOK from "../graphql/mutation/rentBook.gql";
import ADD_WISHLIST from "../graphql/mutation/addWishlist.gql";
import DELETE_WISHLIST from "../graphql/mutation/removeWishlist.gql";
import CHECKOUT_URL from "../graphql/query/checkout.gql";
import VERIFY_PAYMENT from "../graphql/mutation/verifyPayment.gql";
import RETURN_BOOK from "../graphql/mutation/returnbook.gql";
export const bookStore = defineStore({
  id: "books",

  state: () => ({
    books: [],
    book: [],
    rentedBooks: [],
    wishlistedBooks: [],
    updateBookInfo: [],
    limit: 100,
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
    checkoutUrl: "",
    paymentId: "",
    isPaymentVerified: false,
  }),
  actions: {
    setSearchController(payload) {
      this.searchController = payload;
    },
    selectBook(bookId) {
      // Find the book by its ID in the books array
      const selected = this.books.find((book) => book.id === bookId);
      if (selected) {
        this.book = selected;
      } else {
        console.log("Book not found");
      }
    },

    // You can also create a method to clear the selected book
    clearSelectedBook() {
      this.book = [];
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
          query: BOOKS_QUERY,
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

    async getBook(payload) {
      this.isLoading = true;
      try {
        const { $apollo } = useNuxtApp();
        const res = await $apollo.clients.default.query({
          query: QUERY_BOOK,
          variables: {
            bookId: payload,
          },
        });
        console.log(
          "book data from get a single book store bookbjsdnjsd",
          JSON.stringify(res, null, 3)
        );
        this.book = res.data.books_by_pk;
      } catch (error) {
        console.log("error loading book", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getRentedBooks(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();

      try {
        const res = await $apollo.clients.default.query({
          query: RENTED_BOOKS_QUERY,
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

    async deleteBook(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();

      try {
        console.log("Payload for deleteBook:", payload);

        const res = await $apollo.clients.default.mutate({
          mutation: DELETE_BOOK,
          variables: {
            bookId: payload,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
        });

        console.log("DeleteBook Mutation Response:", res);

        if (res.data && res.data.delete_books.affected_rows > 0) {
          console.log(
            "Deleted rows count:",
            res.data.delete_books.affected_rows
          );
          this.successMessage = "Book deleted successfully!";
          this.isDeleted = true;
          this.processResultStatus = true;
        } else {
          this.errorMessages = "No book was deleted. Please check the book ID.";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.error("Error deleting book:", error);
        this.errorMessages = "Unable to delete the book, sorry.";
        this.processResultStatus = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },

    async updateBook(payload) {
      this.isLoading = true;
      const {
        book_id,
        title,
        author,
        genre,
        imageName,
        base64String,
        imageType,
      } = payload;

      const { $apollo } = useNuxtApp();
      try {
        let variables;
        if (imageName || imageType || base64String) {
          variables = {
            book_id,
            title,
            author,
            genre,
            base64String,
            imageType,
            imageName,
          };
        } else {
          variables = {
            book_id,
            title,
            author,
            genre,
          };
        }
        const res = await $apollo.clients.default.mutate({
          mutation: UPDATE_BOOK,
          variables,
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                q: "%%",
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
          onCompleted: (data) => {
            // Access the refetched data here
            console.log("the refetched book  data:", data);
          },
          onError: (error) => {
            console.error("Error during mutation:", error);
          },
        });
        console.log("the response", res);
        if (res.data) {
          const data = res.data;
          this.updateBookInfo = data.updateBook;
          this.successMessage =
            data.updateBook.message || "book updated sucessfully!";
          this.processResultStatus = true;
        } else {
          console.log("error updating the book");
          this.errorMessages = "unable to update the book";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.error(error);
        console.log("error in updating the book:", error);
        this.errorMessage = "Unable to edit the book";
        this.processResult = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },

    async rentBook(payload) {
      this.isLoading = true;
      const { user_id, book_id, return_date, price } = payload;
      const { $apollo } = useNuxtApp();
      try {
        const variables = { book_id, user_id, return_date, price };
        console.log(
          "RentBook variables from the storeeee:",
          JSON.stringify(variables, null, 2)
        );

        const res = await $apollo.clients.default.mutate({
          mutation: RENT_BOOK,
          variables,
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                q: "%%",
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
          onCompleted: (data) => {
            console.log("bood rented completed:", data);
          },
          onError: (error) => {
            console.error("Error during renting the book:", error);
          },
        });
        console.log(
          "the response of renting book mutation:",
          JSON.stringify(res, null, 2)
        );
        if (res.data) {
          const data = res.data.rentbook;
          this.isRented = true;
          console.log(
            "data from rent bookkhgdddd:",
            JSON.stringify(data, null, 2)
          );
          this.paymentId = data.payment_id;
          console.log("the payment id that i wannna see", this.paymentId);
          this.successMessage =
            res.data.rentbook.message || "book rented successfully!";
          this.processResultStatus = true;
        } else {
          this.errorMessages = "unable to rent the book";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.error("Error renting book:", error);
        this.errorMessages = "unable to rent the book";
        this.processResultStatus = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },

    async verifyPayment(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();
      const { id, tx_ref } = payload;

      try {
        const res = await $apollo.clients.default.mutate({
          mutation: VERIFY_PAYMENT,
          variables: {
            id,
            tx_ref,
          },
        });
        console.log(res);
        this.successMessage = res.data.ProcessPayment.message;
        return res.data.ProcessPayment;
      } catch (error) {
        console.error("Error verifying payment", error);
      } finally {
        this.isLoading = false;
      }
    },

    async removeWishlist(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();
      console.log("Payload (wishlist ID) to be deleted:", payload);

      try {
        const res = await $apollo.clients.default.mutate({
          mutation: DELETE_WISHLIST,
          variables: {
            bookId: payload,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                q: "%%",
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
        });
        console.log("result from ustation of wishlis", JSON.stringify(res));
        if (res.data) {
          this.isWishlisted = false;
          this.successMessage = "book wishlist removed successfully!";
          this.processResultStatus = true;
        } else {
          this.errorMessages = "unable to remove the book from wishlist";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.log("error removing the book from wishlist", error);
        this.errorMessages = "unable to remove the book from wishlist";
        this.processResultStatus = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },

    async addWishlist(payload) {
      this.isLoading = true;

      const { bookId, userId } = payload;

      const { $apollo } = useNuxtApp();
      try {
        const variables = { bookId, userId };
        console.log(
          "wiahlist book variables from the storeeee:",
          JSON.stringify(variables, null, 2)
        );
        const res = await $apollo.clients.default.mutate({
          mutation: ADD_WISHLIST,
          variables,
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                q: "%%",
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
          onCompleted: (data) => {
            console.log("book wishlist completed:", data);
          },
          onError: (error) => {
            console.error("Error during wishlisting the book:", error);
          },
        });
        console.log("the response of wishliating book mutation:", res);
        if (res.data) {
          // const data = res.addWishlist;
          this.isWishlisted = true;
          this.successMessage = "book wishlisted successfully!";
          this.processResultStatus = true;
        } else {
          this.errorMessages = "unable to wishlist the book";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.error("error wishlisting a book", error);
        this.processResultStatus = false;
      } finally {
        this.isLoading = false;
        return this.processResultStatus;
      }
    },
    async getCheckOutUrl(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();
      try {
        const res = await $apollo.clients.default.query({
          query: CHECKOUT_URL,
          variables: {
            id: payload,
          },
        });
        this.checkoutUrl = res.data.payments[0].checkout_url;
        console.log("checkout url", res);
      } catch (error) {
        console.error("error fetching checkout url", error);
      } finally {
        this.isLoading = false;
      }
    },
    async returnBook(payload) {
      this.isLoading = true;
      const { $apollo } = useNuxtApp();
      try {
        const res = await $apollo.clients.default.mutate({
          mutation: RETURN_BOOK,
          variables: {
            bookId: payload,
          },
          awaitRefetchQueries: true,
          refetchQueries: [
            {
              query: BOOKS_QUERY,
              variables: {
                q: "%%",
                limit: this.limit,
                offset: this.offset,
              },
            },
          ],
        });
        console.log("return book result", JSON.stringify(res, null, 2));
        if (res.data) {
          this.successMessage =
            res.data.returnBook.message || "book returned successfully!";
          this.processResultStatus = true;
        } else {
          this.errorMessages = "unable to return the book";
          this.processResultStatus = false;
        }
      } catch (error) {
        console.error("error returning book", error);
        this.errorMessages = "unable to return the book";
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
