import { Redis } from '@upstash/redis';
import { randomBytes } from 'crypto';
import createAPI from 'nextkit';

import { prisma } from '@eventalapp/shared/db/client';
import { FullUser, StrippedUser, fullUser, stripUser } from '@eventalapp/shared/utils';

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

const getFullUser = async (uid: string): Promise<FullUser | null> => {
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ slug: uid }, { id: uid }]
		}
	});

	if (!user) return null;

	return fullUser(user);
};

const getStrippedUser = async (uid: string): Promise<StrippedUser | null> => {
	const user = await prisma.user.findFirst({
		where: {
			OR: [{ slug: uid }, { id: uid }]
		}
	});

	if (!user) return null;

	return stripUser(user);
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
			getFullUser,
			getSelfFullUser: async (): Promise<FullUser | null> => {
				const token = await redis.get<string>(`session:${req.cookies.token}`);

				if (!token) {
					return null;
				}

				return getFullUser(token);
			},
			getSelfStrippedUser: async (): Promise<StrippedUser | null> => {
				const token = await redis.get<string>(`session:${req.cookies.token}`);

				if (!token) {
					return null;
				}

				return getStrippedUser(token);
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
