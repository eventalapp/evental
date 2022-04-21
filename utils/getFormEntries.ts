import { FormEvent } from 'react';

export const getFormEntries = (event: FormEvent<HTMLFormElement>) => {
	let formEntries: { [key: string]: string } = {};

	Object.entries(event.target).forEach(([, value]) => {
		if (value.tagName === 'INPUT' || value.tagName === 'TEXTAREA' || value.tagName === 'SELECT') {
			formEntries[value.name] = value.value;
		}
	});

	return formEntries;
};
