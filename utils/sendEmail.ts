import { SESV2 } from 'aws-sdk';

import { SES } from './ses';

export const sendEmail = (params: SESV2.SendEmailRequest): Promise<void> => {
	return new Promise((resolve, reject) => {
		SES.sendEmail(params, (err) => {
			if (err) {
				reject('Failed to send email');
			} else {
				resolve();
			}
		});
	});
};
