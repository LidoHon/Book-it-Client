import { acceptHMRUpdate, defineStore } from "pinia";
import SIGNUP_MUTATION from "../graphql/mutation/signup.gql";

export const authStore = defineStore(
  {
    id: "auth",
    state: () => ({
      onLoad: false,
      user: {},
      notifications: [],
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
            this.user.email = data.email;
            this.user.userName = data.userName;
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
          this.changeOnLoad(false);
        }
      },
    },
  }
  // {}
);
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(authStore, import.meta.hot));
}
