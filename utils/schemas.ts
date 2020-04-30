import { z } from 'zod';
import { isBrowser } from './isBrowser';

// Reusable

const slugValidator = z
	.string()
	.min(1, 'Slug is required.')
	.min(4, 'Slug must be at least 4 characters')
	.max(40, 'Slug must be less than 40 characters')
	.regex(new RegExp(/^(?!-)(?!.*-$).+$/), 'Slug cannot start or end with a hyphen.');

const nameValidator = z
	.string()
	.min(1, 'Slug is required.')
	.min(4, 'Slug must be at least 4 characters')
	.max(40, 'Slug must be less than 100 characters');

const dateValidator = z.preprocess((val) => new Date(val as string | Date), z.date());

const descriptionValidator = z.string().max(400, 'Description must be less than 400 characters');

// Venues

export const CreateVenueSchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	description: descriptionValidator
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const EditVenueSchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	description: descriptionValidator
});

export type EditVenuePayload = z.infer<typeof EditVenueSchema>;

// Role

export const CreateRoleSchema = z.object({
	name: nameValidator,
	slug: slugValidator,
	defaultRole: z.boolean()
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const EditRoleSchema = z.object({
	name: nameValidator,
	slug: slugValidator,
	defaultRole: z.boolean()
});

export type EditRolePayload = z.infer<typeof EditRoleSchema>;

// Activity

export const CreateActivitySchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type CreateActivityPayload = z.infer<typeof CreateActivitySchema>;

export const EditActivitySchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type EditActivityPayload = z.infer<typeof EditActivitySchema>;

// Event

export const CreateEventSchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	location: z
		.string()
		.min(4, 'Location must be at least 4 characters')
		.max(100, 'Location must be less than 40 characters'),
	image: z.string(),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;

export const EditEventSchema = z.object({
	slug: slugValidator,
	name: nameValidator,
	location: z
		.string()
		.min(4, 'Location must be at least 4 characters')
		.max(100, 'Location must be less than 40 characters'),
	image: z.string(),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type EditEventPayload = z.infer<typeof EditEventSchema>;

// Event Attendee

export const CreateAttendeeSchema = z.object({
	name: nameValidator,
	slug: slugValidator,
	company: z.string().max(40, 'Company must be less than 40 characters'),
	position: z.string().max(40, 'Position must be less than 40 characters'),
	description: descriptionValidator,
	location: z.string().max(40, 'Position must be less than 40 characters'),
	image: z.string()
});

export type CreateAttendeePayload = z.infer<typeof CreateAttendeeSchema>;

export const AdminEditAttendeeSchema = z.object({
	name: nameValidator,
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
	image: z.string()
});

export type AdminEditAttendeePayload = z.infer<typeof AdminEditAttendeeSchema>;

// Image Upload

export const ImageUploadSchema = z.object({
	image: isBrowser ? z.instanceof(FileList) : z.any()
});

export type ImageUploadPayload = z.infer<typeof ImageUploadSchema>;
