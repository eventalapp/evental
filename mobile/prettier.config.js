module.exports = {
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	semi: true,
	quoteProps: 'consistent',
	endOfLine: 'crlf',
	bracketSpacing: true,
	arrowParens: 'always',
	importOrder: ['^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	tailwindConfig: './tailwind.config.js',
	plugins: [
		require('@trivago/prettier-plugin-sort-imports')
	]
};
