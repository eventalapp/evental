import { MAX_ATTENDEES } from '@eventalapp/shared/utils';

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

export const sale = {
	flatAmount: 350,
	percentage: 0
};

export const priceAfterSale = (price: number): number => {
	if (sale.flatAmount > 0) {
		const finalPrice = price - sale.flatAmount;

		if (finalPrice < 0) {
			return 0;
		}

		return finalPrice;
	}

	if (sale.percentage > 0) {
		return price * (1 - sale.percentage / 100);
	}

	return price;
};

export let proAttendeePricing: Record<
	string,
	{
		id: string;
		level: string;
		price: number;
		description: string;
		attendees: number;
		perAttendeePrice: number;
		name: string;
		image: string;
	}
> = {};

for (let i = 250; i <= MAX_ATTENDEES; i += 250) {
	const priceForAttendees = proAttendeesToPrice(i);

	proAttendeePricing[String(i)] = {
		id: `evental-pro-${i}`,
		price: priceForAttendees,
		level: 'PRO',
		description: `Evental Pro (${i} Attendees)`,
		name: `Evental Pro (${i} Attendees)`,
		image: `https://cdn.evental.app/images/logo.jpg`,
		attendees: i,
		perAttendeePrice: Number((priceForAttendees / i).toFixed(2))
	};
}

export let eduAttendeePricing: Record<
	string,
	{
		id: string;
		level: string;
		price: number;
		description: string;
		attendees: number;
		perAttendeePrice: number;
		name: string;
		image: string;
	}
> = {};

for (let i = 250; i <= MAX_ATTENDEES; i += 250) {
	const priceForAttendees = eduAttendeesToPrice(i);

	eduAttendeePricing[String(i)] = {
		id: `evental-edu-${i}`,
		price: priceForAttendees,
		level: 'PRO',
		description: `Evental Education/Non-profit (${i} Attendees)`,
		name: `Evental Education/Non-profit (${i} Attendees)`,
		image: `https://cdn.evental.app/images/logo.jpg`,
		attendees: i,
		perAttendeePrice: Number((priceForAttendees / i).toFixed(2))
	};
}
