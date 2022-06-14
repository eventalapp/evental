import { api } from '../../../../../../utils/api';
import { isSessionAttendee } from '../../../../../../utils/isSessionAttendee';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid, sid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsSessionAttendee({ eid: String(eid), userId: user?.id, sid: String(sid) });
	}
});

type GetIsSessionAttendeeArguments = {
	eid: string;
	sid: string;
	userId: string | undefined;
};

export const getIsSessionAttendee = async (
	args: GetIsSessionAttendeeArguments
): Promise<boolean> => {
	const { eid, sid, userId } = args;

	return userId ? await isSessionAttendee(userId, String(eid), String(sid)) : false;
};
