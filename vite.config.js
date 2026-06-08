import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "frontend",
  server: {
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com; " +
        "frame-src https://accounts.google.com; " +
        "connect-src 'self' ws: wss:; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: https:;",
    },
  },
});
