import { defineConfig } from 'vite';
import vscode from '@tomjs/vite-plugin-vscode';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vscode({
      extension: {
        sourcemap: "inline",
      },
    }),
    tsconfigPaths(),
  ],
});
