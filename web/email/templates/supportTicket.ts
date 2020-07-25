import { SESV2 } from 'aws-sdk';
import { NextkitError } from 'nextkit';

import { SubmitSupportTicketPayload } from '@eventalapp/shared/utils';

import { sendEmail } from '../../utils/email';

type SupportTicketEmailArgs = {
	sendToAddress: string;
	payload: SubmitSupportTicketPayload;
};

export const sendSupportTicket = async (args: SupportTicketEmailArgs) => {
	const body = `${Object.entries(args.payload)
		.map(([key, value]) => (value ? `<p>${key}: ${value}</p>` : null))
		.join('\n')}`;

	const params: SESV2.SendEmailRequest = {
		Content: {
			Simple: {
				Body: {
					Html: {
						Data: body,
						Charset: 'UTF-8'
					},
					Text: {
						Data: body,
						Charset: 'UTF-8'
					}
				},
				Subject: {
					Data: `(${args.payload.name}) ${args.payload.attendanceType} ${args.payload.helpType} Support Ticket`,
					Charset: 'UTF-8'
				}
			}
		},
		Destination: {
			ToAddresses: [args.sendToAddress]
		},
		ReplyToAddresses: [`${args.payload.name} <${args.payload.email}>`],
		FromEmailAddress: '"Evental" <no-reply@evental.app>'
	};

	await sendEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
