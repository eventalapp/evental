import { api } from '../../../../utils/api';
import { isAttendee } from '../../../../utils/attendee';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsAttendee({ userId: user?.id, eid: String(eid) });
	}
});

type IsAttendeeArguments = {
	eid: string;
	userId: string | undefined;
};

export const getIsAttendee = async (args: IsAttendeeArguments): Promise<boolean> => {
	const { eid, userId } = args;

	return userId ? await isAttendee(userId, String(eid)) : false;
};
