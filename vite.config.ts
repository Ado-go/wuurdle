import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  },
  plugins: [tailwindcss(), react()],
});
