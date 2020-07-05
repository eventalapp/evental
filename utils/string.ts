export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeOnlyFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const processSlug = (input: string) => {
	return input
		?.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
};

export const generateSlug = async (
	name: string,
	validate: (slug: string) => Promise<boolean>
): Promise<string> => {
	const currentSlug = processSlug(name);

	const isValid = await validate(currentSlug);

	if (isValid) {
		return currentSlug;
	}

	return generateSlug(name + Math.ceil(Math.random() * 10), validate);
};

export const slugify = (input: string) => {
	return input
		?.toString()
		.toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-'); // Replace multiple - with single -
};
