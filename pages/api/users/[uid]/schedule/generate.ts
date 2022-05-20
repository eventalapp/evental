import { api } from '../../../../../utils/api';
import { NextkitError } from 'nextkit';
import { getUser } from '../index';
import ExcelJS from 'exceljs';
import { getSessionsByUser } from '../sessions';
import { htmlToText } from 'html-to-text';

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
			{ header: 'Session Type', key: 'session_type', width: 30 },
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
				session_time: session.startDate,
				session_name: session.name,
				session_type: session.type,
				session_description: htmlToText(session.description ?? ''),
				session_category: session?.type?.name,
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
