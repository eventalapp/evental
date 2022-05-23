import { serialize } from 'cookie';
import { NextkitError } from 'nextkit';

import { api } from '../../../utils/api';

export default api({
	async DELETE({ ctx, req, res }) {
		if (!req.cookies.token) {
			throw new NextkitError(404, 'Already signed out');
		}

		await ctx.redis.del(`session:${req.cookies.token}`);

		const cookie = serialize('token', req.cookies.token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			expires: new Date(),
			sameSite: 'strict'
		});

		res.setHeader('Set-Cookie', cookie);
	}
});
