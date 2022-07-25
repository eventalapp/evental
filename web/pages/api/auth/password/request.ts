import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { ChangePasswordRequestSchema } from '@eventalapp/shared/utils';
import { PASSWORD_RESET_EXPIRY } from '@eventalapp/shared/utils/config';

import { sendResetPassword } from '../../../../email/templates/resetPassword';
import { api } from '../../../../utils/api';

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

		if (user.email) {
			const resetCode = await ctx.getPasswordResetCode();

			await ctx.redis.set(`reset:${resetCode}`, user.id, { ex: PASSWORD_RESET_EXPIRY });

			await sendResetPassword({ toAddresses: [user.email], resetCode });
		}
	}
});
