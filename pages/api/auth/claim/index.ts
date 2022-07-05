import { hash } from 'argon2';
import { serialize } from 'cookie';
import { NextkitError } from 'nextkit';

import { CLAIM_PROFILE_EXPIRY, SESSION_EXPIRY } from '../../../../config';
import { sendWelcomeEmail } from '../../../../email/sendWelcomeEmail';
import { prisma } from '../../../../prisma/client';
import { api } from '../../../../utils/api';
import { ClaimProfileSchema } from '../../../../utils/schemas';
import { stripUser } from '../../../../utils/user';

export default api({
	async POST({ ctx, req, res }) {
		const body = ClaimProfileSchema.parse(req.body);

		const userId = await ctx.redis.get<string>(`claim:${body.code}`);

		if (!userId) {
			throw new NextkitError(
				400,
				`Invalid claim code. claim codes expire after ${
					CLAIM_PROFILE_EXPIRY / 60 / 60 / 24
				} days. Please create an account.`
			);
		}

		await ctx.redis.del(`claim:${body.code}`);

		const passwordHashed = await hash(body.password);

		if (!passwordHashed) {
			throw new NextkitError(500, 'Failed to claim profile');
		}

		const user = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				emailVerified: new Date(),
				password: passwordHashed
			}
		});

		try {
			await sendWelcomeEmail(user.email, user.name);
		} catch {
			// silent fail
		}

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

		return stripUser(user);
	}
});
