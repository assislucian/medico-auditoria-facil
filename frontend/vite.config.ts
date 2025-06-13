import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // mode === 'development' &&
    // componentTagger(),
  ].filter(Boolean),

  // 🆕 Diretivas para evitar erro de resolução
  optimizeDeps: { include: ["jspdf", "jspdf-autotable"] },
  ssr: { noExternal: ["jspdf", "jspdf-autotable"] },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "jspdf-autotable": "jspdf-autotable/dist/jspdf.plugin.autotable"
    },
  },
}));
