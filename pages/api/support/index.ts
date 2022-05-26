import { NextkitError } from 'nextkit';

import { sendSupportTicketEmail } from '../../../email/sendSupportTicketEmail';
import { api } from '../../../utils/api';
import { SubmitSupportTicketSchema } from '../../../utils/schemas';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const body = SubmitSupportTicketSchema.parse(req.body);

		await sendSupportTicketEmail({ sendToAddress: 'support@evental.app', payload: body });
	}
});
