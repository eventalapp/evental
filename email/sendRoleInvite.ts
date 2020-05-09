import mjml2html from 'mjml';
import { convert } from 'html-to-text';
import { sendEmail } from '../utils/sendEmail';
import { SESV2 } from 'aws-sdk';
import Prisma from '@prisma/client';
import { inviteRoleTemplate } from './templates/inviteRole';

type RoleInviteArgs = {
	sendToAddress: string;
	inviteCode: string;
	event: Prisma.Event;
	inviterName: string;
	role: Prisma.EventRole;
};

export const sendRoleInvite = async (args: RoleInviteArgs) => {
	const { sendToAddress, inviteCode, event, inviterName, role } = args;

	const htmlOutput = mjml2html(
		inviteRoleTemplate({
			inviteLink: `${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${
				event.slug
			}/invites/roles/${role.slug}?code=${inviteCode}`,
			event,
			inviterName,
			role
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
					Data: `${role.name} Invite`,
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
