import { api } from '../../../utils/api';
import { NextkitError } from 'nextkit';
import { serialize } from 'cookie';

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
