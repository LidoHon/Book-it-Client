import { acceptHMRUpdate, defineStore } from "pinia";
import SIGNUP_MUTATION from "../graphql/mutation/signup.gql";
import VERIFY_USER from "../graphql/mutation/verifyEmail.gql";
import LOGIN_USER from "../graphql/query/login.gql";
import FORGOT_PASS from "../graphql/mutation/forgotPassword.gql";
import RESET_PASS from "../graphql/mutation/passwordReset.gql";
import UPDATE_PROFILE from "../graphql/mutation/updateProfile.gql";
import PROFILE_QUERY from "../graphql/query/profile.gql";
export const authStore = defineStore(
  {
    id: "auth",
    state: () => ({
      onLoad: false,
      user: {},
      notifications: [],
      rentedBooks: [],
      wishlists: [],
      profileLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isAuthed: false,
      authPages: ["AuthPage"],
      anonymousPages: ["index"],
      protectedPages: ["profile"],
      adminPages: ["admin"],
      role: "anonymous",
      authToken: "",
      userId: "",
      errorMessage: "",
      successMessage: "",
      processResultStatus: false,
      isEmailVerified: false,
    }),
    actions: {
      initAuthState() {
        this.isAuthed = !!localStorage.getItem("authToken");
        this.authToken = localStorage.getItem("authToken") || "";
        this.role = localStorage.getItem("authRole") || "anonymous";
        this.isAdmin = this.role == "admin";
        this.userId = localStorage.getItem("authUserId") || "";
      },

      changeOnLoad(payload) {
        this.onLoad = payload;
      },

      setProfileLoading(payload) {
        this.profileLoading = payload;
      },
      setErrorMessage(payload) {
        this.errorMessage = payload;
      },
      setUserId(payload) {
        this.userId = payload;
      },

      setSuccessMessage(payload) {
        this.successMessage = payload;
      },
      setProcessResultStatus(payload) {
        this.processResultStatus = payload;
      },
      setIsEmailVerified(payload) {
        this.isEmailVerified = payload;
      },
      setNotifications(payload) {
        this.notifications = payload;
      },
      setUser(payload) {
        this.user = payload;
      },

      isAdminPage(page) {
        const thePage = this.adminPages.find((pagename) => {
          pagename == page;
          if (thePage) {
            return true;
          } else {
            return false;
          }
        });
      },
      isProtectedPage(page) {
        const thePage = this.protectedPages.find((pagename) => {
          pagename == page;
          if (thePage) {
            return true;
          } else {
            return false;
          }
        });
      },
      isAnonymousPage(page) {
        const thePage = this.isAnonymousPage.find((pagename) => {
          pagename == page;
          if (thePage) {
            return true;
          } else {
            return false;
          }
        });
      },
      isAuthPage(page) {
        const thePage = this.authPages.find((pagename) => {
          pagename == page;
          if (thePage) {
            return true;
          } else {
            return false;
          }
        });
      },
      getRole() {
        if (localStorage.getItem("authRole")) {
          return localStorage.getItem("authRole");
        }
      },

      async verifyEmail(payload) {
        console.log("verifyEmail function called with payload:", payload);
        const { user_id, verification_token } = payload;
        const { $apollo } = useNuxtApp();

        try {
          this.onLoad = true;
          const res = await $apollo.clients.default.mutate({
            mutation: VERIFY_USER,
            variables: {
              user_id,
              verification_token,
            },
          });
          console.log("Mutation response from the store:", res);
          if (res.data) {
            const data = res.data.verifyEmail.message;
            console.log("verification sucess:", data);
            this.isEmailVerified = true;
            this.successMessage = "Email verified sucessfully!";
          } else {
            this.errorMessage =
              res.errors?.[0]?.message || "verification failed";
          }
        } catch (error) {
          console.error("verififcation errror", error);
          this.errorMessage =
            error.message || "An error occuers during verification";
        } finally {
          this.onLoad = false;
        }
      },

      async loginUser(payload) {
        const { email, password } = payload;
        const { $apollo } = useNuxtApp();

        try {
          const res = await $apollo.clients.default.query({
            query: LOGIN_USER,
            variables: {
              email,
              password,
            },
          });
          if (res.data) {
            const data = res.data.login.user;
            console.log("login data", data);
            this.authToken = data.token;
            this.userId = data.id;
            this.isAuthed = true;
            this.user.email = data.email;
            this.user.userName = data.name;
            this.user.role = data.role;
            this.role = data.role;
            localStorage.setItem("authRole", this.role);
            if (data.role == "admin") {
              this.isAdmin = true;
            }
            localStorage.setItem("authUserId", data.id);
            localStorage.setItem("authToken", data.token);
            this.processResultStatus = true;
          } else {
            this.errorMessage = res.errors[0].message;
            this.processResultStatus = false;
          }
        } catch (error) {
          console.log("login error", error);
          if (error.message) {
            this.setErrorMessage(error.message);
          }
          this.processResultStatus = false;
        } finally {
          this.onLoad = false;
          return this.processResultStatus;
        }
      },

      async logout(payload) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRole");
        localStorage.removeItem("authUserId");
        this.authToken = "";
        this.userId = "";
        this.user = {};
        this.isAdmin = false;
        this.isAuthed = false;
        this.role = "";
        return true;
      },

      async forgotPassword(payload) {
        const { email } = payload;
        const { $apollo } = useNuxtApp();

        try {
          const response = await $apollo.clients.default.mutate({
            mutation: FORGOT_PASS,
            variables: { email },
          });
          if (response.data) {
            const data = response.data;
            console.log("the forgot pass data", data);
            this.processResultStatus = true;
          } else {
            this.errorMessage = response.errors[0].message;
            this.processResultStatus = false;
          }
        } catch (error) {
          console.log("forgot password error");
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.processResultStatus = false;
        } finally {
          this.onLoad = false;
          return this.processResultStatus;
        }
      },
      async resetPassword(payload) {
        const { password, token, userId } = payload;
        const { $apollo } = useNuxtApp();
        try {
          const response = await $apollo.clients.default.mutate({
            mutation: RESET_PASS,
            variables: { password, token, userId },
          });
          if (response.data) {
            const data = response.data;
            console.log("the reset password data:", data);
            if (data.passwordUpdate) {
              this.successMessage = data.passwordUpdate.message
                ? data.passwordUpdate.message
                : "";
            }
            this.processResaltStatus = true;
          } else {
            this.errorMessage = response.errors[0].message;
            this.processResaltStatus = false;
          }
        } catch (error) {
          console.log("reset password error:", error);
          if (error.message) {
            this.errorMessage = error.message;
          }
          this.processResaltStatus = false;
        } finally {
          this.onLoad = false;
          return this.processResaltStatus;
        }
      },

      async updateProfile(payload) {
        const { userName, phone, imageName, imageType, imageBase64String } =
          payload;

        const { $apollo } = useNuxtApp();

        try {
          let variables;
          const userId = localStorage.getItem("authUserId");
          const userIdInt = Number(userId);

          if (imageName || imageType || imageBase64String) {
            variables = {
              userName,
              phone,
              imageName,
              imageType,
              imageBase64String,
              userId: userIdInt,
            };
          } else {
            variables = {
              userName,
              phone,
              userId: userIdInt,
            };
          }

          this.userId = userIdInt;
          const res = await $apollo.clients.default.mutate({
            mutation: UPDATE_PROFILE,
            variables,
            awaitRefetchQueries: true,
            refetchQueries: [
              {
                query: PROFILE_QUERY,
                variables: { id: this.userId },
              },
            ],
            onCompleted: (data) => {
              console.log("the fetched user data", data);
            },

            onError: (error) => {
              console.log("error during fething", error);
            },
          });
          if (res.data) {
            console.log("update profile response", res.data);
            if (res.data.updateProfile.message) {
              this.successMessage = res.data.updateProfile.message;
              this.processResultStatus = true;
            } else {
              this.successMessage = "your profile has been updated succesfully";
              this.processResultStatus = true;
            }
          } else {
            this.errorMessage = res.errors[0].message;
            this.processResultStatus = false;
          }
        } catch (error) {
          console.log("update profile error", error);
          if (error.message) {
            this.setErrorMessage(error.message);
          }
          this.processResultStatus = false;
        } finally {
          this.onLoad = false;
          return this.processResultStatus;
        }
      },

      // async getProfile(payload) {
      //   this.profileLoading = true;
      //   this.userId = Number(localStorage.getItem("authUserId"));
      //   console.log("userid from store", this.userId);
      //   if (!isNaN(this.userId)) {
      //     const { $apollo } = useNuxtApp();
      //     try {
      //       const res = await $apollo.clients.default.query({
      //         query: PROFILE_QUERY,
      //         variables: { id: this.user },
      //       });
      //       if (res.data) {
      //         console.log("the user data", res);
      //         const data = res.data;
      //         this.user = data.users.users_by_pk;

      //         if (this.user) {
      //           this.notifications = data.users_by_pk.notifications;
      //           this.rentedBooks = data.users_by_pk.RentedBooks;
      //           this.wishlists = data.users_by_pk.wishlist;

      //           localStorage.setItem("authRole", this.user.role);
      //           if (this.user.role == "admin") {
      //             this.isAdmin = true;
      //           }
      //         }
      //         this.processResultStatus = true;
      //       } else {
      //         this.errorMessage = res.error[0].message;
      //         this.processResultStatus = false;
      //       }
      //     } catch (error) {
      //       console.error("error getting user data", error);
      //       if (error.message) {
      //         this.errorMessage = error.message;
      //       }
      //       this.processResultStatus = false;
      //     } finally {
      //       this.profileLoading = false;
      //       return this.processResultStatus;
      //     }
      //   }
      // },

      async getProfile(payload) {
        this.profileLoading = true;
        this.userId = Number(localStorage.getItem("authUserId"));
        console.log("User ID from store:", this.userId);

        if (!isNaN(this.userId)) {
          const { $apollo } = useNuxtApp();
          try {
            const res = await $apollo.clients.default.query({
              query: PROFILE_QUERY,
              variables: { id: this.userId }, // Use this.userId instead of this.user
            });

            if (res.data && res.data.users_by_pk) {
              console.log("User data:", res);

              const user = res.data.users_by_pk;
              this.user = user; // Assign the user data to this.user

              if (user) {
                this.notifications = user.notifications;
                this.rentedBooks = user.RentedBooks;
                this.wishlists = user.wishlist;

                localStorage.setItem("authRole", user.role);
                this.isAdmin = user.role === "admin";
              }
              this.processResultStatus = true;
            } else {
              this.errorMessage =
                res.errors?.[0]?.message || "Unknown error occurred.";
/*************  ✨ Codeium Command ⭐  *************/
          /**
           * Called when the mutation is completed and the refetched data is available
           * @param {Object} data The refetched data, which includes the updated user profile
           */
/******  e8d9f37d-44e5-4dd4-a6d9-2ee7ab8f5dd5  *******/              this.processResultStatus = false;
            }
          } catch (error) {
            console.error("Error getting user data:", error);
            this.errorMessage = error.message || "Failed to fetch user data.";
            this.processResultStatus = false;
          } finally {
            this.profileLoading = false;
          }
        } else {
          console.error("Invalid user ID.");
          this.errorMessage = "Invalid user ID.";
          this.processResultStatus = false;
        }

        return this.processResultStatus;
      },

      async signupUser(payload) {
        const {
          email,
          password,
          userName,
          phone,
          imageName,
          imageType,
          imageBase64String,
        } = payload;

        const { $apollo } = useNuxtApp();

        try {
          let variables;
          if (imageName || imageType || imageBase64String) {
            variables = {
              email,
              password,
              userName,
              phone,
              imageName,
              imageType,
              imageBase64String,
            };
          } else {
            variables = {
              email,
              password,
              userName,
              phone,
            };
          }
          const res = await $apollo.clients.default.mutate({
            mutation: SIGNUP_MUTATION,
            variables,
          });
          console.log(res);

          if (res.data) {
            const data = res.data.signup;
            console.log("the signup data:", data);
            this.authToken = data.token;
            this.userId = data.id;
            this.isAuthed = true;
            console.log("is authed", this.isAuthed);
            this.user.email = data.email;
            this.user.userName = data.userName;
            console.log("name", this.user.userName);
            this.user.role = data.role;
            this.role = data.role;
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("authRole", data.role);
            if (data.role == "admin") {
              this.isAdmin = true;
            }
            localStorage.setItem("authUserId", data.id);
            this.processResultStatus = true;
          } else {
            this.errorMessage = res.errors[0].message;
            this.processResultStatus = false;
          }
        } catch (error) {
          console.log("signup error", error);
          if (error.message) {
            this.setErrorMessage(error.message);
          }
          this.processResultStatus = false;
        } finally {
          this.onLoad = false;
          return this.processResultStatus;
        }
      },
    },
  }
  // {}
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
