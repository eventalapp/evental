import { hash } from 'argon2';
import { serialize } from 'cookie';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { ChangePasswordSchema } from '@eventalapp/shared/utils';
import { PASSWORD_RESET_EXPIRY, SESSION_EXPIRY } from '@eventalapp/shared/utils/config';

import { api } from '../../../../utils/api';

export default api({
	async POST({ ctx, req, res }) {
		const body = ChangePasswordSchema.parse(req.body);

		const userId = await ctx.redis.get<string>(`reset:${body.code}`);

		if (!userId) {
			throw new NextkitError(
				400,
				`Invalid reset code. Reset codes expire after ${
					PASSWORD_RESET_EXPIRY / 60
				} minutes. Please request another.`
			);
		}

		await ctx.redis.del(`reset:${body.code}`);

		const passwordHashed = await hash(body.password);

		if (!passwordHashed) {
			throw new NextkitError(500, 'Failed to reset password');
		}

		const user = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				password: passwordHashed
			}
		});

		const token = await ctx.getToken();

		await ctx.redis.set(`session:${token}`, user.id, { ex: SESSION_EXPIRY });

		const cookie = serialize('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			expires: new Date(+new Date() + 1000 * SESSION_EXPIRY),
			sameSite: 'strict'
		});

		res.setHeader('Set-Cookie', cookie);

		const { password, ...rest } = user;

		return rest;
	}
});
