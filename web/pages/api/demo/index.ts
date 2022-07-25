import { NextkitError } from 'nextkit';

import { SubmitDemoRequestSchema } from '@eventalapp/shared/utils';

import { sendDemoRequest } from '../../../email/templates/demoRequest';
import { api } from '../../../utils/api';

export default api({
	async POST({ ctx, req }) {
		const user = await ctx.getSelfStrippedUser();

		if (!user?.id) {
			throw new NextkitError(401, 'You must be logged in to do this.');
		}

		if (!user.emailVerified) {
			throw new NextkitError(
				401,
				'You must verify your account to do this. Request a verification email in your user settings by clicking on your profile in the top right.'
			);
		}

		const body = SubmitDemoRequestSchema.parse(req.body);

		await sendDemoRequest({ sendToAddress: 'support@evental.app', payload: body });
	}
});
