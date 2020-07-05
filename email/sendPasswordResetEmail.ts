import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { sendEmail } from '../utils/email';
import { forgotPasswordTemplate } from './templates/forgotPassword';

export const sendPasswordResetEmail = async (sendToAddress: string, resetCode: string) => {
	const htmlOutput = mjml2html(
		forgotPasswordTemplate(
			`${
				process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
			}/auth/password/reset?code=${resetCode}`
		)
	);

	const text = convert(htmlOutput.html, {
		wordwrap: 130
	});

	const params: SESV2.SendEmailRequest = {
		Content: {
			Simple: {
				Body: {
					Html: {
						Data: htmlOutput.html,
						Charset: 'UTF-8'
					},
					Text: {
						Data: text,
						Charset: 'UTF-8'
					}
				},
				Subject: {
					Data: 'Password Reset',
					Charset: 'UTF-8'
				}
			}
		},
		Destination: {
			ToAddresses: [sendToAddress]
		},
		ReplyToAddresses: ['"Evental Support" <support@evental.app>'],
		FromEmailAddress: '"Evental" <no-reply@evental.app>'
	};

	await sendEmail(params);
};
