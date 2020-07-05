import Prisma from '@prisma/client';
import { SESV2 } from 'aws-sdk';
import { convert } from 'html-to-text';
import mjml2html from 'mjml';

import { sendEmail } from '../email';
import { claimProfileTemplate } from './templates/claimProfile';

type ClaimProfileEmailArgs = {
	event: Prisma.Event;
	inviterName: string;
	role: Prisma.EventRole;
	sendToAddress: string;
	claimCode: string;
};

export const sendClaimProfileEmail = async (args: ClaimProfileEmailArgs) => {
	const { event, inviterName, role, sendToAddress, claimCode } = args;

	const htmlOutput = mjml2html(
		claimProfileTemplate({
			inviterName: inviterName,
			claimLink: `${
				process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'
			}/auth/claim?code=${claimCode}`,
			event,
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
					Data: 'Claim your profile',
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
