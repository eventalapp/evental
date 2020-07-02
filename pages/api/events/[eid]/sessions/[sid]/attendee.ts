import { api } from '../../../../../../utils/api';
import {
	IsSessionAttendeeArguments,
	isSessionAttendee
} from '../../../../../../utils/isSessionAttendee';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getStrippedUser();
		const { eid, sid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsSessionAttendee({ eid: String(eid), userId: user?.id, sid: String(sid) });
	}
});

export const getIsSessionAttendee = async (args: IsSessionAttendeeArguments): Promise<boolean> => {
	const { eid, sid, userId } = args;

	return userId
		? await isSessionAttendee({ eid: String(eid), userId: userId, sid: String(sid) })
		: false;
};
