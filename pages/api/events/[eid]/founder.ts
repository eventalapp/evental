import { isFounder } from '../../../../utils/isFounder';
import { api } from '../../../../utils/api';

export default api({
	async GET({ ctx, req }) {
		const user = await ctx.getUser();
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
