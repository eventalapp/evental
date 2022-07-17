import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { htmlToText } from 'html-to-text';
import { NextkitError } from 'nextkit';

import { api } from '../../../../../utils/api';
import { getUser } from '../index';
import { getSessionsByUser } from '../sessions';

export default api.raw({
	async GET({ req, res }) {
		const { uid } = req.query;

		const user = await getUser(String(uid));

		if (!user) {
			throw new NextkitError(404, 'User not found.');
		}

		const workbook = new ExcelJS.Workbook();

		workbook.creator = 'Evental.app';
		workbook.lastModifiedBy = 'Evental.app';

		const worksheet = workbook.addWorksheet('Your Schedule');

		worksheet.columns = [
			{ header: 'Event Name', key: 'name', width: 30 },
			{ header: 'Session Time', key: 'session_time', width: 30 },
			{ header: 'Session Name', key: 'session_name', width: 30 },
			{ header: 'Session Description', key: 'session_description', width: 30 },
			{ header: 'Session Category', key: 'session_category', width: 30 },
			{ header: 'Session Venue', key: 'session_venue', width: 30 },
			{ header: 'Session Venue Address', key: 'session_venue_address', width: 30 }
		];

		const sessionsResponse = await getSessionsByUser(user.id);

		if (!sessionsResponse) {
			throw new NextkitError(404, 'Sessions not found.');
		}

		sessionsResponse.forEach((session) => {
			worksheet.addRow({
				name: session.name,
				session_time: `${dayjs(session.startDate).format('dddd, MMM D h:mm A z')} - ${dayjs(
					session.endDate
				).format('dddd, MMM D h:mm A z')}`,
				session_name: session.name,
				session_description: htmlToText(session.description ?? ''),
				session_category: session?.category?.name,
				session_venue: session?.venue?.name,
				session_venue_address: session?.venue?.address
			});
		});

		res.setHeader(
			'Content-Type',
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		);

		res.setHeader('Content-Disposition', `attachment; filename=${user.slug}_schedule.xlsx`);

		await workbook.xlsx.write(res);

		res.end();
	}
});
