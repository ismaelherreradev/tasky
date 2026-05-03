import { cloudflare } from "@cloudflare/vite-plugin"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite-plus"

const config = defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    semi: false,
    sortImports: {},
    sortTailwindcss: {
      stylesheet: "./src/styles.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn", "cva", "tw"],
    },
    sortPackageJson: true,
    ignorePatterns: [
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "bun.lock",
      "routeTree.gen.ts",
      ".tanstack-start/",
      ".tanstack/",
      "drizzle/",
      "migrations/",
      ".drizzle/",
      ".cache",
      "worker-configuration.d.ts",
      ".vercel",
      ".output",
      ".wrangler",
      ".netlify",
      "dist",
    ],
  },
  lint: {
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ["react", "typescript", "import", "jsx-a11y"],
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn",
    },
    rules: {
      "typescript/no-explicit-any": "warn",
      "typescript/consistent-type-imports": "error",
      "react/self-closing-comp": "error",
      "react/jsx-no-target-blank": "error",
      "react/react-in-jsx-scope": "off",
      "import/no-cycle": "warn",
      "no-console": "warn",
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
    },
    settings: {
      "jsx-a11y": {
        polymorphicPropName: undefined,
        components: {},
        attributes: {},
      },
      next: {
        rootDir: [],
      },
      react: {
        formComponents: [],
        linkComponents: [],
        version: "19",
        componentWrapperFunctions: [],
      },
      jsdoc: {
        ignorePrivate: false,
        ignoreInternal: false,
        ignoreReplacesDocs: true,
        overrideReplacesDocs: true,
        augmentsExtendsReplacesDocs: false,
        implementsReplacesDocs: false,
        exemptDestructuredRootsFromChecks: false,
        tagNamePreference: {},
      },
      vitest: {
        typecheck: false,
      },
    },
    env: {
      builtin: true,
      browser: true,
    },
    globals: {},
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
})

export default config
