import { processSlug } from './slugify';

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
