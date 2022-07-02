import { api } from '../../../utils/api';

export default api({
	async GET({ ctx }) {
		return await ctx.getStrippedUser();
	}
});
