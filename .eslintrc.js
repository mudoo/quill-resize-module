// http://eslint.org/docs/user-guide/configuring
module.exports = {
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true
	},
	// https://github.com/standard/standard/blob/master/docs/RULES-en.md
	// extends: 'standard',
	extends: 'eslint:recommended',
	// required to lint *.vue files
	plugins: [
		'html'
	],
	"globals": {
		"$": true,
		"define": true,
		"require": true
    },
	// add your custom rules here
	'rules': {
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}
