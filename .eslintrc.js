const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
  },
  // add your custom rules here
  rules: {
    'no-console': 'warn',
    'no-debugger': isDev ? 'off' : 'error',
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'linebreak-style': ['error', 'unix'],
    'comma-dangle': ['warn', 'always-multiline'],
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],
    'spaced-comment': ['error', 'always', {
      line: {
        markers: ['/'],
        exceptions: ['-', '+', '/'],
      },
    }],
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    '@typescript-eslint/no-explicit-any': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
  },
}
