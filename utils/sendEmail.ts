import { SES } from './ses';
import { SESV2 } from 'aws-sdk';
import { NextkitError } from 'nextkit';

export const sendEmail = (params: SESV2.SendEmailRequest): Promise<void> => {
	return new Promise((resolve) => {
		SES.sendEmail(params, (err) => {
			if (err) {
				throw new NextkitError(500, 'Failed to send email');
			} else {
				resolve();
			}
		});
	});
};
