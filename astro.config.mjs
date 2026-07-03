// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static site (no server adapter). Vercel serves the built `dist/`.
// `cleanUrls` + the CORS/content-type headers live in vercel.json.
export default defineConfig({
  integrations: [react()],
  redirects: {
    // Common typo/ambiguity: HF0 uses a zero, but users often type "hfo".
    '/programs/hfo-hacker-fellowship-zero': '/programs/hf0-hacker-fellowship-zero',
    '/find-support': '/explore',
    '/find-your-orbit': '/explore',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
