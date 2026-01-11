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
    // Hardcoded values - tidak perlu set environment variables di Vercel
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://hpneyyqvuttbznzyprio.supabase.co',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwbmV5eXF2dXR0YnpuenlwcmlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTMxODIsImV4cCI6MjA4MzQ2OTE4Mn0.V8wbp1A34JuSQP5KLIFpZkonutAWXRU-xvJuo_hV6Cg'
    }
  },
  css: ['~/assets/css/main.css']
})
