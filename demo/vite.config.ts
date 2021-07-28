import { defineConfig } from "vite";
import reactJsx from "vite-react-jsx";

import reactRefresh from "@vitejs/plugin-react-refresh";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    base: "/",
    root: "./",
    plugins: [reactRefresh(), reactJsx(), VitePWA()],
    resolve: {
        alias: [
            { find: "@", replacement: "/src" },
            { find: "jotai-yjs", replacement: path.join(process.cwd(), "../", "./src/index.ts") },
            // { find: "jotai-yjs", replacement: path.join(process.cwd(), "../", "./dist/jotai-yjs.es.js") },
        ],
    },
});
