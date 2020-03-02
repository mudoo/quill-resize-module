const isDev = process.env.NODE_ENV === 'development'
module.exports = {
  extends: [
    'standard',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    "no-console": "warn",
    "no-debugger": isDev ? "off" : "error",
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    "linebreak-style": ["error", "unix"],
  }
}
