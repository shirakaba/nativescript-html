module.exports = {
    root: true,
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      // sourceType: "module",
      tsconfigRootDir: __dirname,
      project: ['./tsconfig.json'],
    },
    // overrides: [
    //   {
    //     files: ['*.ts', '*.tsx'], // Your TypeScript files extension
    //     parserOptions: {
    //       project: ['./tsconfig.json'], // Specify it only for TypeScript files
    //     },
    //   },
    // ],
    ignorePatterns: ["example/**/*", ".eslintrc.js", "src/jsdom/**/*"],
    plugins: [
      '@typescript-eslint',
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
};
