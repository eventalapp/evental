export const capitalizeFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeOnlyFirstLetter = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};
