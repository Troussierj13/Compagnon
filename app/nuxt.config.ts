export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],

  supabase: {
    // Seul le MJ a un compte Supabase Auth.
    // Les joueurs accèdent via un code de session (pas de redirect auth).
    redirect: false,
  },

  runtimeConfig: {
    // Clés serveur uniquement (non exposées au client)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    nfcSecret: process.env.NFC_SECRET,
    public: {
      // Clés publiques accessibles côté client
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
    },
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})
