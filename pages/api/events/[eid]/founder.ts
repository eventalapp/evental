import { api } from '../../../../utils/api';
import { isFounder } from '../../../../utils/attendee';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();
		const { eid } = req.query;

		if (!user?.id) {
			return false;
		}

		return await getIsFounder(String(eid), user?.id);
	}
});

export const getIsFounder = async (eid: string, userId: string | undefined): Promise<boolean> => {
	return userId ? await isFounder(String(eid), userId) : false;
};
