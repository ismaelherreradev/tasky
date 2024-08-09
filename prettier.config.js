/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  tabWidth: 2,
  printWidth: 100,
  importOrder: [
    "use client",
    "use server",
    "",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^~/types/(.*)$",
    "^~/config/(.*)$",
    "^~/lib/(.*)$",
    "^~/hooks/(.*)$",
    "^~/components/ui/(.*)$",
    "^~/components/(.*)$",
    "^~/registry/(.*)$",
    "^~/styles/(.*)$",
    "^~/app/(.*)$",
    "",
    "^[./]",
  ],
  plugins: [
    "prettier-plugin-tailwindcss",
    "@ianvs/prettier-plugin-sort-imports",
  ],
};

export default config;
