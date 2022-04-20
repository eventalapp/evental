import { PrismaAdapter } from '@next-auth/prisma-adapter';
import Prisma from '@prisma/client';
import NextAuth from 'next-auth';
import prisma from '../../../prisma/client';
import { providers } from '../../../utils/providers';

export default NextAuth({
	providers,
	pages: {
		signIn: '/auth/signin',
		newUser: '/'
	},
	adapter: PrismaAdapter(prisma),
	logger: {
		error(code, ...message) {
			console.error(code, message);
		},
		warn(code, ...message) {
			console.warn(code, message);
		},
		debug(code, ...message) {
			console.debug(code, message);
		}
	},
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		session: async ({ session, user }) => {
			session.user = user as Prisma.User;

			return Promise.resolve(session);
		},
		signIn: async (params) => {
			// Capitalize first character of "bearer", some providers don't do this
			if (params.account.token_type)
				params.account.token_type =
					params.account.token_type.substring(0, 1).toUpperCase() +
					params.account.token_type.substring(1);
			return true;
		}
	}
});
