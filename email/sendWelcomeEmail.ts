import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { sendEmail } from '../utils/sendEmail';
import { SESV2 } from 'aws-sdk';
import { welcomeTemplate } from './templates/welcome';

export const sendWelcomeEmail = async (sendToAddress: string, name: string) => {
	const htmlOutput = mjml2html(
		welcomeTemplate({
			name: name,
			viewEventPageLink: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events`,
			updateProfileLink: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/settings`,
			createEventLink: `${
				process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
			}/events/create`
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
					Data: 'Welcome to Evental!',
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
