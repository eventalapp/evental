import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { sendEmail } from '../utils/sendEmail';
import { SESV2 } from 'aws-sdk';
import { inviteOrganizerTemplate } from './templates/inviteOrganizer';
import Prisma from '@prisma/client';

export const sendOrganizerInvite = async (
	sendToAddress: string,
	inviteCode: string,
	event: Prisma.Event,
	inviterName: string
) => {
	const htmlOutput = mjml2html(
		inviteOrganizerTemplate(
			`${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${
				event.slug
			}/invites/organizer?code=${inviteCode}`,
			event,
			inviterName
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
					Data: 'Organizer Invite',
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
