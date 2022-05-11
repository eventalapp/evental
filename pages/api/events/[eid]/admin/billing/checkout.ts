import { api } from '../../../../../../utils/api';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();
		const { eid } = req.query;
	}
});
