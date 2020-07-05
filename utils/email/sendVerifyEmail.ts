import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { sendEmail } from './';
import { verifyEmailTemplate } from './templates/verifyEmail';

type VerifyEmailArgs = {
	sendToAddress: string;
	verifyCode: string;
};

export const sendVerifyEmail = async (args: VerifyEmailArgs) => {
	const { sendToAddress, verifyCode } = args;

	const htmlOutput = mjml2html(
		verifyEmailTemplate({
			verifyLink: `${
				process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
			}/auth/verify?code=${verifyCode}`
		})
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
					Data: `Verify your account`,
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
