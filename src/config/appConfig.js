export const appConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  },
  runpod: {
    faceswapUrl: import.meta.env.VITE_RUNPOD_FACESWAP_URL || "",
    apiKey: import.meta.env.VITE_RUNPOD_API_KEY || "",
  },
  buckets: {
    images: "phonepe_images",
    characters: "phonepe_character_images", // Updated bucket name for faceswap
  },
  tables: {
    images: "event_output_images",
  },
  polling: {
    maxAttempts: 60,
    interval: 3000, // 3 seconds
  },
};
