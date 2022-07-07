import { NextkitError } from 'nextkit';

import { sendVerifyEmail } from '../../../../email/templates/verifyEmail';
import { api } from '../../../../utils/api';
import { VERIFY_EMAIL_EXPIRY } from '../../../../utils/config';

export default api({
	async POST({ ctx }) {
		const user = await ctx.getFullUser();

		if (!user) {
			throw new NextkitError(404, 'User not found');
		}

		if (user.emailVerified) {
			throw new NextkitError(400, 'Email already verified');
		}

		const verifyCode = await ctx.getVerifyEmailCode();

		await ctx.redis.set(`verify:${verifyCode}`, user.id, { ex: VERIFY_EMAIL_EXPIRY });

		if (user.email) {
			await sendVerifyEmail({ verifyCode, toAddresses: [user.email] });
		}
	}
});
