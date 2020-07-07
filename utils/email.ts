import { SESV2 } from 'aws-sdk';

import { SES } from './client';

export const sendEmail = (params: SESV2.SendEmailRequest): Promise<void> => {
	return new Promise((resolve, reject) => {
		SES.sendEmail(params, (err) => {
			if (err) {
				console.error(err);
				reject('Failed to send email');
			} else {
				resolve();
			}
		});
	});
};

export const sendBulkEmail = (params: SESV2.SendBulkEmailRequest): Promise<void> => {
	return new Promise((resolve, reject) => {
		SES.sendBulkEmail(params, (err) => {
			if (err) {
				console.error(err);
				reject('Failed to send email');
			} else {
				resolve();
			}
		});
	});
};
