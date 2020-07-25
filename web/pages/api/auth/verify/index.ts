import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { VerifyEmailSchema, stripUser } from '@eventalapp/shared/utils';
import { VERIFY_EMAIL_EXPIRY } from '@eventalapp/shared/utils/config';

import { api } from '../../../../utils/api';

export default api({
	async POST({ ctx, req }) {
		const body = VerifyEmailSchema.parse(req.body);

		const userId = await ctx.redis.get<string>(`verify:${body.code}`);

		if (!userId) {
			throw new NextkitError(
				400,
				`Invalid verification code. Verification codes expire after ${
					VERIFY_EMAIL_EXPIRY / 60
				} minutes. Please request another.`
			);
		}

		await ctx.redis.del(`verify:${body.code}`);

		const user = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				emailVerified: new Date()
			}
		});

		return stripUser(user);
	}
});
