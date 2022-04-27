import isISODate from 'is-iso-date';
import { z } from 'zod';

// Venues

export const CreateVenueSchema = z.object({
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const EditVenueSchema = z.object({
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long')
});

export type EditVenuePayload = z.infer<typeof EditVenueSchema>;

// Role

export const CreateRoleSchema = z.object({
	name: z
		.string()
		.min(4, 'Role must be at least 4 characters')
		.max(50, 'Role must be less than 50 characters'),
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	defaultRole: z.boolean()
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const EditRoleSchema = z.object({
	name: z
		.string()
		.min(4, 'Role must be at least 4 characters')
		.max(50, 'Role must be less than 50 characters'),
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	defaultRole: z.boolean()
});

export type EditRolePayload = z.infer<typeof EditRoleSchema>;

// Activity

export const CreateActivitySchema = z.object({
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateActivityPayload = z.infer<typeof CreateActivitySchema>;

export const EditActivitySchema = z.object({
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type EditActivityPayload = z.infer<typeof EditActivitySchema>;

// Event

export const CreateEventSchema = z.object({
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	name: z
		.string()
		.min(4, 'Name must be at least 4 characters')
		.max(100, 'Name must be less than 100 characters'),
	location: z
		.string()
		.min(4, 'Location must be at least 4 characters')
		.max(100, 'Location must be less than 40 characters'),
	image: typeof window === 'undefined' ? z.any() : z.instanceof(FileList),
	startDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	endDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;

export const EditEventSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	location: z.string().min(1, 'Location must be specified').max(100, 'Location is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type EditEventPayload = z.infer<typeof EditEventSchema>;

// Event Member

export const EditAttendeeSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters'),
	company: z.string().max(40, 'Company must be less than 40 characters'),
	position: z
		.string()

		.max(40, 'Position must be less than 40 characters'),
	eventRoleId: z.string().min(1, 'Role is required').max(100, 'Role is too long')
});

export type EditAttendeePayload = z.infer<typeof EditAttendeeSchema>;
