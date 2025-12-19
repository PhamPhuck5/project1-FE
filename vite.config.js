import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Load biến từ file .env dựa vào mode ('development', 'production', ...)
  const env = loadEnv(mode, process.cwd());

  return {
    // base: env.VITE_REACT_APP_ROUTER_BASE_NAME || "/",
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      allowedHosts: [
        "fb7b43d4553d.ngrok-free.app", // thêm host của ngrok
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true, // Tắt warning từ node_modules (Bootstrap nằm trong đây)
        },
      },
    },
  };
});
