import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { sendEmail } from '../utils/sendEmail';
import { forgotPasswordTemplate } from './templates/forgotPassword';
import { SESV2 } from 'aws-sdk';

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
		FromEmailAddress: '"Evental" <no-reply@evental.app>'
	};

	await sendEmail(params);
};
