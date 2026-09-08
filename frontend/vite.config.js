import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true }, // host:true = reachable on localhost (IPv4+IPv6) and LAN
});

