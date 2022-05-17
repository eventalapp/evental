import { faker } from '@faker-js/faker';
import Prisma from '@prisma/client';

export const fake = (count: number) => {
	// Fake users

	let i = 1;

	let fakeUsers: Array<Omit<Prisma.User, 'createdAt' | 'updatedAt'>> = [];

	while (i <= count) {
		fakeUsers.push({
			id: `faker-user-#${i}`,
			slug: faker.internet.userName().toLowerCase(),
			name: `${faker.name.firstName()} ${faker.name.lastName()}`,
			email: faker.internet.email(),
			emailVerified: Math.random() >= 0.5 ? new Date() : null,
			image: '/images/default-event.jpg',
			company: faker.company.companyName(),
			password: faker.internet.password(),
			role: 'USER',
			location: faker.address.city(),
			website: faker.internet.url(),
			position: faker.name.jobTitle(),
			description: faker.lorem.sentence()
		});

		i++;
	}

	// Fake events

	let fakeEvent: Omit<Prisma.Event, 'createdAt' | 'updatedAt'>;

	fakeEvent = {
		id: `faker-event-#${i}`,
		privacy: 'PUBLIC',
		website: faker.internet.url(),
		maxAttendees: 500,
		slug: faker.internet.userName().toLowerCase(),
		name: `${faker.name.firstName()} ${faker.name.lastName()}'s Event`,
		description: faker.lorem.sentence(),
		location: faker.address.city(),
		password: faker.internet.password(),
		image: '/images/default-event.jpg',
		startDate: new Date(),
		timeZone: 'America/New_York',
		endDate: new Date(),
		category: 'EVENT',
		type: 'HYBRID',
		address: faker.address.streetAddress(),
		banner: faker.image.avatar(),
		level: 'PRO',
		timeFormat: 'TWELVE_HOURS'
	};

	// Fake roles

	i = 1;

	let fakeRoles: Array<Omit<Prisma.EventRole, 'createdAt' | 'updatedAt'>> = [];

	while (i <= 5) {
		fakeRoles.push({
			id: `faker-role-#${i}`,
			slug: faker.internet.userName().toLowerCase(),
			name: `${faker.name.firstName()} ${faker.name.lastName()}`,
			defaultRole: i === 1,
			eventId: fakeEvent.id
		});

		i++;
	}

	// Fake attendees

	i = 1;

	let fakeAttendees: Array<Omit<Prisma.EventAttendee, 'createdAt' | 'updatedAt'>> = [];

	while (i <= count) {
		fakeAttendees.push({
			id: `faker-event-#${i}`,
			userId: fakeUsers[i - 1].id,
			eventId: fakeEvent.id,
			permissionRole: 'ATTENDEE',
			eventRoleId: fakeRoles[0].id
		});
		i++;
	}

	// Fake attendees

	i = 1;

	let fakeSessions: Array<
		Omit<Prisma.EventSession, 'createdAt' | 'updatedAt' | 'typeId' | 'venueId'>
	> = [];

	while (i <= count) {
		fakeSessions.push({
			id: `faker-event-#${i}`,
			eventId: fakeEvent.id,
			name: `${faker.name.firstName()} ${faker.name.lastName()}`,
			description: faker.lorem.sentence(),
			startDate: new Date(),
			slug: faker.internet.userName().toLowerCase(),
			endDate: new Date()
		});
		i++;
	}

	return {
		fakeUsers,
		fakeEvent,
		fakeAttendees,
		fakeRoles,
		fakeSessions
	};
};
