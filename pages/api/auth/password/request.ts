import { NextkitError } from 'nextkit';

import { PASSWORD_RESET_EXPIRY } from '../../../../config';
import { sendPasswordResetEmail } from '../../../../email/sendPasswordResetEmail';
import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { ChangePasswordRequestSchema } from '../../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const body = ChangePasswordRequestSchema.parse(req.body);

		const user = await prisma.user.findFirst({
			where: {
				email: body.email
			}
		});

		if (!user) {
			throw new NextkitError(404, 'User not found');
		}

		const resetCode = await ctx.getPasswordResetCode();

		await ctx.redis.set(`reset:${resetCode}`, user.id, { ex: PASSWORD_RESET_EXPIRY });

		await sendPasswordResetEmail(user.email, resetCode);
	}
});
