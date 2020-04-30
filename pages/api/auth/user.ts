import { api } from '../../../utils/api';

export default api({
	async GET({ ctx }) {
		await ctx.getUser();
	}
});
