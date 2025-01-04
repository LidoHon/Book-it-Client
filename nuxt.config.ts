// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxtjs/apollo",
    "@pinia/nuxt",
    [
      "@vee-validate/nuxt",
      {
        autoImports: true,
      },
    ],
    [
      "@vee-validate/nuxt",
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: "VeeForm",
          Field: "VeeField",
          FieldArray: "VeeFieldArray",
          ErrorMessage: "VeeErrorMessage",
        },
      },
    ],
    "@pinia/nuxt",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  apollo: {
    autoImports: true,
    clients: {
      default: {
        httpEndpoint: "http://localhost:8080/v1/graphql",
        tokenStorage: "localStorage",
        authHeader: "Authorization",
        authType: "Bearer",
        tokenName: "authToken",
        httpLinkOptions: {
          headers: {
            "x-hasura-admin-secret": "myadminsecretkey",
          },
        },
      },
    },
  },
});
