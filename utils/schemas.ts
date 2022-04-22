import isISODate from 'is-iso-date';
import { z } from 'zod';

export const CreateVenueSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const CreateRoleSchema = z.object({
	name: z
		.string()
		.min(4, 'Role must be at least 4 characters')
		.max(50, 'Role must be less than 50 characters'),
	slug: z
		.string()
		.min(4, 'Slug must be at least 4 characters')
		.max(40, 'Slug must be less than 40 characters')
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const CreateActivitySchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateActivityPayload = z.infer<typeof CreateActivitySchema>;

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
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;

export const UpdateEventSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	location: z.string().min(1, 'Location must be specified').max(100, 'Location is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export type UpdateEventPayload = z.infer<typeof UpdateEventSchema>;
