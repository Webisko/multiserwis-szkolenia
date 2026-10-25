// @ts-check

import tailwind from "@tailwindcss/vite";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://multiserwis.edu.pl",
  integrations: [react()],
  vite: {
    plugins: [tailwind()],
  },
});
