export const proAttendeesToPrice = (attendees: number): number => {
	const step1 = attendees / 2;

	const step2 = step1 + 220;

	return Math.round(step2 / 10) * 10;
};

export const eduAttendeesToPrice = (attendees: number): number => {
	const step1 = attendees / 2.75;

	const step2 = step1 + 110;

	return Math.round(step2 / 10) * 10;
};

export const priceToAttendees = (price: number): number => {
	const step1 = price - 200;

	return step1 * 2;
};
