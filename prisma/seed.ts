import { PrismaClient } from '@prisma/client';
import { fake } from '../utils/fake';
import { SEED_USERS_TO_GENERATE } from '../config';

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
		await prisma.event.upsert({
			where: {
				id: fakeData.fakeEvent.id
			},
			create: {
				id: fakeData.fakeEvent.id,
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
			},
			update: {
				id: fakeData.fakeEvent.id,
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
				const { id, eventId, slug, name, defaultRole } = fakeRole;

				return {
					id,
					eventId,
					slug,
					name,
					defaultRole
				};
			}),
			skipDuplicates: true
		});

		await prisma.eventAttendee.createMany({
			data: fakeData.fakeAttendees.map((fakeAttendee) => {
				const { id, userId, permissionRole, eventId } = fakeAttendee;

				return {
					id,
					userId,
					permissionRole,
					eventId,
					eventRoleId: String(fakeData.fakeRoles[0]?.id)
				};
			}),
			skipDuplicates: true
		});

		await prisma.eventSession.createMany({
			data: fakeData.fakeSessions.map((fakeSession) => {
				const { id, name, endDate, startDate, slug, eventId, description } = fakeSession;

				return {
					id,
					name,
					endDate,
					startDate,
					slug,
					eventId,
					description
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
