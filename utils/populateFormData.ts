export const populateFormData = (data: Record<string, unknown>) => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof FileList && value.length >= 1) {
			formData.append(key, value[0], value[0]?.name);
		} else if (value instanceof Date) {
			formData.append(key, value.toISOString());
		} else {
			formData.append(key, String(value));
		}
	});

	return formData;
};
