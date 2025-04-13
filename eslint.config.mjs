import { defineConfig, globalIgnores } from 'eslint/config';
import vue from 'eslint-plugin-vue';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import parser from 'vue-eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(['**/dist', '**/node_modules', '**/target', '**/.git']),
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:vue/vue3-essential',
      'plugin:@typescript-eslint/recommended'
    ),

    plugins: {
      vue,
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        module: true,
        ref: true,
        shallowRef: true,
        markRaw: true,
        reactive: true,
        defineAsyncComponent: true,
        useRouter: true,
        useRoute: true,
        computed: true,
        watch: true,
      },

      parser: parser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },

    rules: {
      'quotes': ['error', 'single'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/no-setup-props-destructure': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },

    ignores: ['dist', 'node_modules', 'target', '.git'],
  },
]);
