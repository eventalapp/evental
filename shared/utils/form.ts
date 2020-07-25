export const populateFormData = (data: Record<string, unknown>) => {
	const formData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value instanceof File) {
			formData.append(key, value, value.name);
		} else if (value instanceof Date) {
			formData.append(key, value.toISOString());
		} else {
			if (value !== undefined && !(typeof value === 'string' && value?.length === 0)) {
				formData.append(key, String(value));
			}
		}
	});

	return formData;
};
