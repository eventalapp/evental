import type Prisma from '@prisma/client';
import { format } from 'date-fns';

export const groupByDate = (arr: Prisma.EventSession[]) => {
	let dateHashmap: { [key: string]: { [key: string]: Prisma.EventSession[] } } = {};

	arr
		.sort((a, b) => {
			return a.startDate < b.startDate ? -1 : 1;
		})
		.forEach((item) => {
			let startDateFormatted = String(format(new Date(item.startDate), 'yyyy-MM-dd'));

			let startHourFormatted = String(format(new Date(item.startDate), 'yyyy-MM-dd HH:mm'));

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

	return dateHashmap;
};
