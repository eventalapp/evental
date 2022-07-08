import { NextkitError } from 'nextkit';

import { api } from '../../../../../../../../utils/api';
import { isOrganizer } from '../../../../../../../../utils/attendee';
import { getEvent } from '../../../../index';

export const config = {
	api: {
		bodyParser: false
	}
};

export default api({
	async GET({ ctx, req }) {
		const { eid, uid } = req.query;

		const requestingUser = await ctx.getSelfStrippedUser();

		if (!requestingUser?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!(await isOrganizer(String(requestingUser?.id), String(eid)))) {
			throw new NextkitError(403, 'You must be an organizer to do this.');
		}

		const event = await getEvent(String(eid));

		if (!event) {
			throw new NextkitError(404, 'Event not found.');
		}

		const userToFetch = await ctx.getFullUser(String(uid));

		if (!userToFetch) {
			throw new NextkitError(404, 'User not found.');
		}

		if (userToFetch.claimedAt) {
			throw new NextkitError(400, 'This user has been claimed and cannot be fetched in full.');
		}

		return userToFetch;
	}
});
