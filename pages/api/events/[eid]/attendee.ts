import { api } from '../../../../utils/api';
import { isAttendee } from '../../../../utils/isAttendee';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsAttendee(user?.id, String(eid));
	}
});

export const getIsAttendee = async (userId: string | undefined, eid: string): Promise<boolean> => {
	return userId ? await isAttendee(userId, String(eid)) : false;
};
