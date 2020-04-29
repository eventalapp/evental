import isISODate from 'is-iso-date';
import { z } from 'zod';
import { isBrowser } from './isBrowser';

const slugValidator = z
	.string()
	.min(4, 'Slug must be at least 4 characters')
	.max(40, 'Slug must be less than 40 characters')
	.regex(new RegExp(/^(?!-+)/), 'Slug cannot start with a hyphen.')
	.regex(new RegExp(/(?!-+)$/), 'Slug cannot end with a hyphen.');

const descriptionValidator = z
	.string()
	.min(4, 'Description must be at least 4 characters')
	.max(400, 'Description must be less than 400 characters');

// Venues

export const CreateVenueSchema = z.object({
	slug: slugValidator,
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: descriptionValidator
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const EditVenueSchema = z.object({
	slug: slugValidator,
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: descriptionValidator
});

export type EditVenuePayload = z.infer<typeof EditVenueSchema>;

// Role

export const CreateRoleSchema = z.object({
	name: z
		.string()
		.min(4, 'Role must be at least 4 characters')
		.max(50, 'Role must be less than 50 characters'),
	slug: slugValidator,
	defaultRole: z.boolean()
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const EditRoleSchema = z.object({
	name: z
		.string()
		.min(4, 'Role must be at least 4 characters')
		.max(50, 'Role must be less than 50 characters'),
	slug: slugValidator,
	defaultRole: z.boolean()
});

export type EditRolePayload = z.infer<typeof EditRoleSchema>;

// Activity

export const CreateActivitySchema = z.object({
	slug: slugValidator,
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	endDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	description: descriptionValidator
});

export type CreateActivityPayload = z.infer<typeof CreateActivitySchema>;

export const EditActivitySchema = z.object({
	slug: slugValidator,
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	endDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	description: descriptionValidator
});

export type EditActivityPayload = z.infer<typeof EditActivitySchema>;

// Event

export const CreateEventSchema = z.object({
	slug: slugValidator,
	name: z
		.string()
		.min(4, 'Name must be at least 4 characters')
		.max(100, 'Name must be less than 100 characters'),
	location: z
		.string()
		.min(4, 'Location must be at least 4 characters')
		.max(100, 'Location must be less than 40 characters'),
	image: isBrowser ? z.instanceof(FileList) : z.any(),
	startDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	endDate: z.preprocess((val) => new Date(val as string | Date), z.date()),
	description: descriptionValidator
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;

export const EditEventSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	location: z.string().min(1, 'Location must be specified').max(100, 'Location is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: descriptionValidator
});

export type EditEventPayload = z.infer<typeof EditEventSchema>;

// Event Attendee

export const CreateAttendeeSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	slug: slugValidator,
	company: z.string().max(40, 'Company must be less than 40 characters'),
	position: z.string().max(40, 'Position must be less than 40 characters'),
	description: z.string().max(40, 'Position must be less than 300 characters'),
	location: z.string().max(40, 'Position must be less than 40 characters'),
	image: isBrowser ? z.instanceof(FileList) : z.any()
});

export type CreateAttendeePayload = z.infer<typeof CreateAttendeeSchema>;

export const AdminEditAttendeeSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	slug: slugValidator,
	company: z.string().max(40, 'Company must be less than 40 characters'),
	position: z.string().max(40, 'Position must be less than 40 characters'),
	description: descriptionValidator,
	location: z.string().max(40, 'Position must be less than 40 characters'),
	eventRoleId: z.string().min(1, 'Role is required').max(100, 'Role is too long'),
	permissionRole: z
		.string()
		.min(1, 'Permission Role is required')
		.max(100, 'Permission Role is too long'),
	image: isBrowser ? z.instanceof(FileList).or(z.string()) : z.any().or(z.string())
});

export type AdminEditAttendeePayload = z.infer<typeof AdminEditAttendeeSchema>;
