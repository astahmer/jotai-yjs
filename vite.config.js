import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    root: "./",
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "jotai-yjs",
            fileName: (format) => `jotai-yjs.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ["jotai", "valtio", "valtio-yjs", "react", "yjs", "y-websocket"],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    // vue: "Vue",
                },
            },
        },
    },
});
