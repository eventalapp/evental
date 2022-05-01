import { isOrganizer } from '../../../../utils/isOrganizer';
import { api } from '../../../../utils/api';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsOrganizer(user?.id, String(eid));
	}
});

export const getIsOrganizer = async (userId: string | undefined, eid: string): Promise<boolean> => {
	return userId ? await isOrganizer(userId, String(eid)) : false;
};
