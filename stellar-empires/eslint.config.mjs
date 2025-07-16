import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";


export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "off",               // For JS/TS (base)
      "@typescript-eslint/no-unused-vars": "off", // For TS (plugin)
    },
  },
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { 
      globals: {...globals.browser, ...globals.node} 
    },
    rules: {
      "no-unused-vars": "off",               // For JS/TS (base)
      "@typescript-eslint/no-unused-vars": "off", // For TS (plugin)
    },
  },
]);
