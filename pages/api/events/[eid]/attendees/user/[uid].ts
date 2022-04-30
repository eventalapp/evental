import { prisma } from '../../../../../../prisma/client';
import { getEvent } from '../../index';
import { EventAttendeeUser } from '../[aid]';
import { api } from '../../../../../../utils/api';

export default api({
	async GET({ req, res }) {
		const { eid, uid } = req.query;

		const eventAttendee = await getAttendeeByUserId(String(eid), String(uid));

		if (!eventAttendee) {
			return res.status(200).end();
		}

		return eventAttendee;
	}
});

export const getAttendeeByUserId = async (
	eid: string,
	uid: string
): Promise<EventAttendeeUser | null> => {
	const event = await getEvent(String(eid));

	if (!event) {
		return null;
	}

	if (!uid) {
		return null;
	}

	const eventAttendee = await prisma.eventAttendee.findFirst({
		where: {
			userId: String(uid),
			eventId: event.id
		},
		include: {
			user: {
				select: {
					name: true,
					image: true
				}
			},
			role: {
				select: {
					name: true
				}
			}
		}
	});

	if (!eventAttendee) {
		return null;
	}

	return eventAttendee;
};
