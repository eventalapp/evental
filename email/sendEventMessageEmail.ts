import Prisma from '@prisma/client';
import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { sendEmail } from '../utils/sendEmail';
import { eventMessageTemplate } from './templates/eventMessageTemplate';

type EventMessageArgs = {
	sendToAddresses: string[];
	sentBy?: string;
	title: string;
	body: string;
	event: Prisma.Event;
};

export const sendEventMessageEmail = async (args: EventMessageArgs) => {
	const { sendToAddresses, body, title, sentBy, event } = args;

	const htmlOutput = mjml2html(eventMessageTemplate({ body, title, sentBy, event }));

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
					Data: title,
					Charset: 'UTF-8'
				}
			}
		},
		Destination: {
			ToAddresses: sendToAddresses
		},
		ReplyToAddresses: ['"Evental Support" <support@evental.app>'],
		FromEmailAddress: `"${title} - ${event.name}" <no-reply@evental.app>`
	};

	await sendEmail(params);
};
