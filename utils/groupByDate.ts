import type Prisma from '@prisma/client';
import dayjs from 'dayjs';

export const groupByDate = (arr: Prisma.EventActivity[]) => {
	let dateHashmap: { [key: string]: { [key: string]: Prisma.EventActivity[] } } = {};

	arr
		.sort((a, b) => {
			return a.startDate < b.startDate ? -1 : 1;
		})
		.forEach((item) => {
			let startDateFormatted = String(dayjs(item.startDate).format('YYYY-MM-DD'));

			let startHourFormatted = String(dayjs(item.startDate).format('YYYY-MM-DD HH:mm'));

			if (!dateHashmap[startDateFormatted]) {
				dateHashmap[startDateFormatted] = {};
			}

			if (
				dateHashmap[startDateFormatted] &&
				dateHashmap[startDateFormatted][startHourFormatted] !== undefined
			) {
				dateHashmap[startDateFormatted][startHourFormatted] = [
					...dateHashmap[startDateFormatted][startHourFormatted],
					item
				];
			} else {
				dateHashmap[startDateFormatted][startHourFormatted] = [item];
			}
		});

	console.log(dateHashmap);

	return dateHashmap;
};
