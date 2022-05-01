import { serialize } from 'cookie';
import { api } from '../../../utils/api';
import { prisma } from '../../../prisma/client';
import { verify } from 'argon2';
import { SignInSchema } from '../../../utils/schemas';
import { NextkitError } from 'nextkit';

const EXPIRY = 60 * 60 * 24 * 7;

export default api({
	async POST({ ctx, req, res }) {
		const token = await ctx.getToken();

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

		await ctx.redis.set(`session:${token}`, user.id, { ex: EXPIRY });

		const cookie = serialize('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			expires: new Date(+new Date() + 1000 * EXPIRY),
			sameSite: 'strict'
		});

		res.setHeader('Set-Cookie', cookie);

		const { password, ...rest } = user;

		return rest;
	}
});