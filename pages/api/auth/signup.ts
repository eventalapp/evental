import { hash } from 'argon2';
import { serialize } from 'cookie';
import { NextkitError } from 'nextkit';

import { prisma } from '../../../prisma/client';
import { api } from '../../../utils/api';
import { SESSION_EXPIRY, VERIFY_EMAIL_EXPIRY } from '../../../utils/config';
import { sendVerifyEmail } from '../../../utils/email/sendVerifyEmail';
import { SignUpSchema } from '../../../utils/schemas';
import { generateSlug } from '../../../utils/string';

export default api({
	async POST({ ctx, req, res }) {
		const body = SignUpSchema.parse(req.body);

		const existing = await prisma.user.findFirst({
			where: { email: body.email },
			select: {
				id: true
			}
		});

		if (existing) {
			throw new NextkitError(409, 'Email already registered');
		}

		const passwordHashed = await hash(body.password);

		if (!passwordHashed) {
			throw new NextkitError(500, 'Failed to create user');
		}

		const slug = await generateSlug(body.name, async (val) => {
			return !Boolean(
				await prisma.user.findFirst({
					where: {
						slug: val
					}
				})
			);
		});

		const user = await prisma.user.create({
			data: {
				slug,
				name: body.name,
				email: body.email,
				password: passwordHashed
			}
		});

		if (!user) {
			throw new NextkitError(500, 'Failed to create user');
		}

		const token = await ctx.getToken();

		await ctx.redis.set(`session:${token}`, user.id, { ex: SESSION_EXPIRY });

		const cookie = serialize('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
			expires: new Date(new Date().getTime() + 1000 * SESSION_EXPIRY),
			sameSite: 'strict'
		});

		res.setHeader('Set-Cookie', cookie);

		try {
			const verifyCode = await ctx.getVerifyEmailCode();

			await ctx.redis.set(`verify:${verifyCode}`, user.id, { ex: VERIFY_EMAIL_EXPIRY });

			if (user.email) {
				await sendVerifyEmail({ verifyCode, sendToAddress: user.email });
			}
		} catch {
			// silent fail
		}

		const { password, ...rest } = user;

		return rest;
	}
});
