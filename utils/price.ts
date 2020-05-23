export const attendeesToPrice = (attendees: number): number => {
	const step1 = attendees / 2;

	const step2 = step1 + 200;

	return Math.round(step2 / 10) * 10;
};

export const priceToAttendees = (price: number): number => {
	const step1 = price - 200;

	return step1 * 2;
};
