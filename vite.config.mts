import { defineConfig } from 'vite';
import vscode from '@tomjs/vite-plugin-vscode';
import preact from "@preact/preset-vite";
import tsconfigPaths from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    vscode({
      extension: {
        sourcemap: "inline",
      },
    }),
    tsconfigPaths(),
  ],
});
