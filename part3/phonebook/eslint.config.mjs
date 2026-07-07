// importing the recommended config from eslint to use as a base
import js from '@eslint/js'
// importing globals for predefined variables like process in node
import globals from 'globals'
// importing stylistic plugin for formatting rules
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  // first element is the recommended base config, second is our custom one
  js.configs.recommended,
  {
    // applies to all javascript files in the project
    files: ['**/*.js'],
    languageOptions: {
      // using commonjs over ES6 modules since we use require()
      sourceType: 'commonjs',
      // tells eslint about node-specific globals like process, __dirname, require
      // so it doesn't flag them as undefined
      globals: { ...globals.node },
      // configure to deal with latest ECMAScript features
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off', // we don't want console.log warnings, so we disable the default rule
    },
  },
  {
    // ignore the dist directory since it contains the built frontend
    ignores: ['dist/**'],
  },
]