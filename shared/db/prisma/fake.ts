import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';

export const fake = (count: number) => {
	// Fake users

	const randomNumber = Math.ceil(Math.random() * 1000);

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
			description: faker.lorem.sentence(),
			claimedAt: null
		});

		i++;
	}

	// Fake events

	let fakeEvent: Omit<Prisma.Event, 'createdAt' | 'updatedAt'>;

	fakeEvent = {
		color: '#f44336',
		id: `faker-event-#${randomNumber}`,
		privacy: 'PUBLIC',
		website: faker.internet.url(),
		maxAttendees: 500,
		slug: faker.internet.userName().toLowerCase(),
		name: `${faker.name.firstName()} ${faker.name.lastName()}'s Event`,
		description: faker.lorem.sentence(),
		location: faker.address.city(),
		password: faker.internet.password(),
		image: '/images/default-event.jpg',
		startDate: dayjs(new Date()).add(20, 'day').toDate(),
		timeZone: 'America/New_York',
		endDate: dayjs(new Date()).add(40, 'day').toDate(),
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
			id: `faker-attendee-#${i}`,
			userId: fakeUsers[i - 1].id,
			eventId: fakeEvent.id,
			permissionRole: 'ATTENDEE',
			eventRoleId: fakeRoles[0].id,
			featured: false
		});
		i++;
	}

	// Fake attendees

	i = 1;

	let fakeSessions: Array<
		Omit<Prisma.EventSession, 'createdAt' | 'updatedAt' | 'categoryId' | 'venueId'>
	> = [];

	while (i <= count) {
		fakeSessions.push({
			id: `faker-session-#${i}`,
			eventId: fakeEvent.id,
			maxAttendees: null,
			name: `${faker.name.firstName()} ${faker.name.lastName()}`,
			description: faker.lorem.sentence(),
			startDate: dayjs(new Date()).add(25, 'day').toDate(),
			slug: faker.internet.userName().toLowerCase(),
			endDate: dayjs(new Date()).add(26, 'day').toDate()
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
