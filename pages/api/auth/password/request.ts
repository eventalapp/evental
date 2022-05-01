import { ChangePasswordRequestSchema } from '../../../../utils/schemas';
import { api } from '../../../../utils/api';
import { sendPasswordResetEmail } from '../../../../email/sendPasswordResetEmail';
import { NextkitError } from 'nextkit';
import { prisma } from '../../../../prisma/client';
import { PASSWORD_RESET_EXPIRY } from '../../../../config';

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

		//Reset code expires in 30 minutes
		await ctx.redis.set(`reset:${resetCode}`, user.id, { ex: PASSWORD_RESET_EXPIRY });

		await sendPasswordResetEmail(user.email, resetCode);
	}
});
