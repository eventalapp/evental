import { PrismaClient } from '@prisma/client/edge';

import { SEED_USERS_TO_GENERATE } from '../../utils';
import { fake } from './fake';

const prisma = new PrismaClient();

const fakeData = fake(SEED_USERS_TO_GENERATE);

export const seed = async () => {
	// Users

	try {
		await prisma.user.createMany({
			data: fakeData.fakeUsers.map((fakeUser) => {
				const {
					id,
					name,
					emailVerified,
					email,
					company,
					image,
					location,
					description,
					position,
					role,
					password,
					slug,
					website
				} = fakeUser;

				return {
					id,
					name,
					emailVerified,
					email,
					company,
					image,
					location,
					description,
					position,
					role,
					password,
					slug,
					website
				};
			}),
			skipDuplicates: true
		});
	} catch (error) {
		console.error({
			message: 'Database faker users seeding has failed.',
			error
		});
	}

	// Events

	try {
		const event = await prisma.event.create({
			data: {
				maxAttendees: fakeData.fakeEvent.maxAttendees,
				address: fakeData.fakeEvent.address,
				timeZone: fakeData.fakeEvent.timeZone,
				color: fakeData.fakeEvent.color,
				password: fakeData.fakeEvent.password,
				website: fakeData.fakeEvent.website,
				privacy: fakeData.fakeEvent.privacy,
				endDate: fakeData.fakeEvent.endDate,
				name: fakeData.fakeEvent.name,
				startDate: fakeData.fakeEvent.startDate,
				type: fakeData.fakeEvent.type,
				banner: fakeData.fakeEvent.banner,
				level: fakeData.fakeEvent.level,
				slug: fakeData.fakeEvent.slug,
				timeFormat: fakeData.fakeEvent.timeFormat,
				description: fakeData.fakeEvent.description,
				location: fakeData.fakeEvent.location
			}
		});

		await prisma.eventRole.createMany({
			data: fakeData.fakeRoles.map((fakeRole) => {
				const { slug, name, defaultRole, id } = fakeRole;

				return {
					eventId: event.id,
					slug,
					name,
					defaultRole,
					id
				};
			}),
			skipDuplicates: true
		});

		await prisma.eventAttendee.createMany({
			data: fakeData.fakeAttendees.map((fakeAttendee) => {
				const { userId, permissionRole } = fakeAttendee;

				return {
					userId,
					permissionRole,
					eventId: event.id,
					eventRoleId: String(fakeData.fakeRoles[0]?.id)
				};
			}),
			skipDuplicates: true
		});

		await prisma.eventSession.createMany({
			data: fakeData.fakeSessions.map((fakeSession) => {
				const { name, endDate, startDate, slug, description } = fakeSession;

				return {
					name,
					endDate,
					startDate,
					slug,
					eventId: event.id,
					description
				};
			}),
			skipDuplicates: true
		});

		const attendees = await prisma.eventAttendee.findMany({
			where: {
				eventId: event.id
			}
		});

		const session = await prisma.eventSession.findFirst({
			where: {
				eventId: event.id
			}
		});

		if (!session) {
			console.error({
				message: 'Session not found.'
			});
			return;
		}

		await prisma.eventSessionAttendee.createMany({
			data: attendees.map((attendee) => {
				return {
					eventId: event.id,
					attendeeId: attendee.id,
					sessionId: session.id
				};
			}),
			skipDuplicates: true
		});
	} catch (error) {
		console.error({
			message: 'Events seeding has failed.',
			error
		});
	}
};

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
