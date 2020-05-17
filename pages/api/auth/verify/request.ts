import { api } from '../../../../utils/api';
import { NextkitError } from 'nextkit';
import { VERIFY_EMAIL_EXPIRY } from '../../../../config';
import { sendVerifyEmail } from '../../../../email/sendVerifyEmail';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user) {
			throw new NextkitError(404, 'User not found');
		}

		if (user.emailVerified) {
			throw new NextkitError(400, 'Email already verified');
		}

		const verifyCode = await ctx.getVerifyEmailCode();

		await ctx.redis.set(`verify:${verifyCode}`, user.id, { ex: VERIFY_EMAIL_EXPIRY });

		await sendVerifyEmail({ verifyCode, sendToAddress: user.email });
	}
});
