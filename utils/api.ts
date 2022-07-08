import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import createAPI, { NextkitError } from 'nextkit';

import { prisma } from '../prisma/client';
import { FullUser, StrippedUser, fullUser, stripUser } from './user';

const redis = new Redis({
	url: process.env.UPSTASH_URL!,
	token: process.env.UPSTASH_TOKEN!
});

const getToken = async (): Promise<string> => {
	const token = randomBytes(128).toString('hex');

	const count = await redis.exists(`session:${token}`);

	if (count > 0) {
		return getToken();
	}

	return token;
};

const getClaimProfileCode = async (): Promise<string> => {
	const token = randomBytes(48).toString('hex');

	const count = await redis.exists(`claim:${token}`);

	if (count > 0) {
		return getClaimProfileCode();
	}

	return token;
};

const getVerifyEmailCode = async (): Promise<string> => {
	const token = randomBytes(48).toString('hex');

	const count = await redis.exists(`verify:${token}`);

	if (count > 0) {
		return getVerifyEmailCode();
	}

	return token;
};

const getPasswordResetCode = async (): Promise<string> => {
	const token = randomBytes(128).toString('hex');

	const count = await redis.exists(`reset:${token}`);

	if (count > 0) {
		return getPasswordResetCode();
	}

	return token;
};

const getRoleInviteCode = async (): Promise<string> => {
	const token = randomBytes(48).toString('hex');

	const count = await redis.exists(`role:${token}`);

	if (count > 0) {
		return getRoleInviteCode();
	}

	return token;
};

const getOrganizerInviteCode = async (): Promise<string> => {
	const token = randomBytes(48).toString('hex');

	const count = await redis.exists(`organizer:${token}`);

	if (count > 0) {
		return getOrganizerInviteCode();
	}

	return token;
};

export const api = createAPI({
	async getContext(req) {
		return {
			redis,
			prisma,
			getToken,
			getPasswordResetCode,
			getOrganizerInviteCode,
			getVerifyEmailCode,
			getRoleInviteCode,
			getClaimProfileCode,
			getFullUser: async (): Promise<FullUser | null> => {
				const token = await redis.get<string>(`session:${req.cookies.token}`);

				if (!token) {
					throw new NextkitError(401, "You're not logged in");
				}

				const user = await prisma.user.findFirst({
					where: {
						id: token
					}
				});

				if (!user) return null;

				return fullUser(user);
			},
			getStrippedUser: async (): Promise<StrippedUser | null> => {
				const token = await redis.get<string>(`session:${req.cookies.token}`);

				if (!token) {
					throw new NextkitError(401, "You're not logged in");
				}

				const user = await prisma.user.findFirst({
					where: {
						id: token
					}
				});

				if (!user) return null;

				return stripUser(user);
			}
		};
	},

	async onError(req, res, error) {
		return {
			status: 500,
			message: error.message
		};
	}
});
