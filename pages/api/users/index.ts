import { NextkitError } from 'nextkit';
import { api } from '../../../utils/api';
import { prisma } from '../../../prisma/client';
import { EditUserSchema } from '../../../utils/schemas';

export default api({
	async PUT({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		const body = EditUserSchema.parse(req.body);

		await prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				...body
			}
		});
	}
});
