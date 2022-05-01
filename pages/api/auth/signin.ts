import { serialize } from 'cookie';
import { api } from '../../../utils/api';
import { prisma } from '../../../prisma/client';
import { verify } from 'argon2';
import { SignInSchema } from '../../../utils/schemas';
import { NextkitError } from 'nextkit';
import { SESSION_EXPIRY } from '../../../config';

export default api({
	async POST({ ctx, req, res }) {
		const body = SignInSchema.parse(req.body);

		const user = await prisma.user.findFirst({
			where: {
				email: body.email
			}
		});

		if (!user) {
			throw new NextkitError(400, 'Invalid email or password');
		}

		const passwordHashed = await verify(user.password, body.password);

		if (!passwordHashed) {
			throw new NextkitError(400, 'Invalid email or password');
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

		const { password, ...rest } = user;

		return rest;
	}
});
