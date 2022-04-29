export const slugify = (input: string) => {
	return input
		?.trim()
		.replace(/[\])}[{(]/g, '')
		.replace(/\s+/g, '-')
		.toLowerCase();
};
