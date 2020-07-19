module.exports = {
	plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
	useTabs: true,
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	semi: true,
	quoteProps: 'consistent',
	endOfLine: 'lf',
	bracketSpacing: true,
	arrowParens: 'always',
	importOrder: ['@eventalapp', '^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true
};
