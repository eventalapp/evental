import { verify } from 'argon2';
import { serialize } from 'cookie';
import { NextkitError } from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { SESSION_EXPIRY, SignInSchema, stripUser } from '@eventalapp/shared/utils';

import { api } from '../../../utils/api';

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

		if (!user.password) {
			throw new NextkitError(500, 'Please reset your password');
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

		return stripUser(user);
	}
});
