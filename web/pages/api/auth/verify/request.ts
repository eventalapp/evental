import { NextkitError } from 'nextkit';

import { VERIFY_EMAIL_EXPIRY } from '@eventalapp/shared/utils/config';

import { sendVerifyEmail } from '../../../../email/templates/verifyEmail';
import { api } from '../../../../utils/api';

export default api({
	async POST({ ctx }) {
		const user = await ctx.getSelfFullUser();

		if (!user) {
			throw new NextkitError(404, 'User not found');
		}

		if (user.emailVerified) {
			throw new NextkitError(400, 'Email already verified');
		}

		if (user.email) {
			const verifyCode = await ctx.getVerifyEmailCode();

			await ctx.redis.set(`verify:${verifyCode}`, user.id, { ex: VERIFY_EMAIL_EXPIRY });

			await sendVerifyEmail({ verifyCode, toAddresses: [user.email] });
		}
	}
});
