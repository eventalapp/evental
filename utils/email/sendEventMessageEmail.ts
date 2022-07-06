import Prisma from '@prisma/client';
import { SESV2 } from 'aws-sdk';
import { NextkitError } from 'nextkit';

import { sendBulkEmail } from './index';

type EventMessageArgs = {
	toAddresses: string[];
	sentBy?: string;
	title: string;
	body: string;
	event: Prisma.Event;
};

export const sendEventMessageEmail = async (args: EventMessageArgs) => {
	const { toAddresses, title, body, event } = args;

	const bulkEntries: SESV2.BulkEmailEntryList = toAddresses.map((address) => ({
		Destination: { ToAddresses: [address] }
	}));

	const templateData = {
		eventImageUrl: `https://cdn.evental.app${event.image}`,
		eventUrl: `https://evental.app/events/${event.slug}`,
		eventName: event.name,
		title,
		body,
		messageUrl: `https://evental.app/events/${event.slug}/messages`
	};

	const params: SESV2.SendBulkEmailRequest = {
		FromEmailAddress: 'messages@evental.app',
		BulkEmailEntries: bulkEntries,
		DefaultContent: {
			Template: {
				TemplateData: JSON.stringify(templateData),
				TemplateName: 'EventMessage'
			}
		}
	};

	await sendBulkEmail(params).catch((err) => {
		throw new NextkitError(500, err);
	});
};
