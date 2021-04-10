module.exports = {
	root: true,
	env: {
		browser: true,
	},
	parser: "@babel/eslint-parser",
	parserOptions: {
		babelOptions: {
			configFile: "./.babelrc"
		}
	},
	extends: [
		"eslint:recommended",
		"react-app"
	],
	ignorePatterns: ["build/", "bundle/server/node_modules/", "node_modules/", "bundle/jsx/", "public/", "**/bodymovin.js", "**/CSInterface.js", "**/*.bundle.js", "**/*.min.js", "**/lottie.js", "bundle/assets/player/"],
	rules: {
		"import/no-anonymous-default-export": "off",
		"jsx-a11y/anchor-is-valid": "off",
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"no-empty": ["error", { "allowEmptyCatch": true }],
		"no-async-promise-executor": "off",

		// This should be re-enabled at some point after fixing mixed indents
		"no-mixed-spaces-and-tabs": "off",
	}
}
