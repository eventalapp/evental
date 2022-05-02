import { serialize } from 'cookie';
import { api } from '../../../utils/api';
import { prisma } from '../../../prisma/client';
import { hash } from 'argon2';
import { SignUpSchema } from '../../../utils/schemas';
import { NextkitError } from 'nextkit';
import { SESSION_EXPIRY } from '../../../config';
import { generateSlug } from '../../../utils/generateSlug';
import { sendWelcomeEmail } from '../../../email/sendWelcomeEmail';

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

		await sendWelcomeEmail(user.email, user.name);

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

		const { password, ...rest } = user;

		return rest;
	}
});
