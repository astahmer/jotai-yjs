import { defineConfig } from "vite";
import path from "path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    root: "./",
    plugins: [peerDepsExternal()],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "jotai-yjs",
            fileName: (format) => `jotai-yjs.${format}.js`,
        },
    },
});
