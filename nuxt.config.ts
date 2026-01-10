// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Private keys (server-side only)
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    apiToken: process.env.API_TOKEN || 'abc321Xyz',
    defaultAccount: process.env.DEFAULT_ACCOUNT || '270787386',
    
    // Public keys (exposed to client)
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },
  css: ['~/assets/css/main.css']
})
