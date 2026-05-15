import { defineConfig } from 'oxlint'

export default defineConfig({
    plugins: ['typescript'],
    categories: {
        correctness: 'warn',
    },
    rules: {
        'eslint/no-unused-vars': 'error',
    },
})
