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
	.min(1, 'Name is required.')
	.min(4, 'Name must be at least 4 characters')
	.max(100, 'Name must be less than 100 characters');

const dateValidator = z.preprocess((val) => new Date(val as string | Date), z.date());

const descriptionValidator = z.string().max(400, 'Description must be less than 400 characters');

const emailValidator = z
	.string()
	.min(1, 'Email is required')
	.email('Invalid email address')
	.max(80, 'Email must be less than 80 characters');

const passwordValidator = z
	.string()
	.min(1, 'Password is required')
	.min(8, 'Password must be at least 8 characters')
	.max(80, 'Password must be less than 80 characters');

const codeValidator = z
	.string()
	.min(1, 'Code is required')
	.min(10, 'Code must be at least 10 characters')
	.max(300, 'Code must be less than 300 characters');

// Venues

export const CreateVenueSchema = z.object({
	name: nameValidator,
	description: descriptionValidator
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const EditVenueSchema = z.object({
	name: nameValidator,
	description: descriptionValidator
});

export type EditVenuePayload = z.infer<typeof EditVenueSchema>;

// Role

export const CreateRoleSchema = z.object({
	name: nameValidator,
	defaultRole: z.boolean()
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const EditRoleSchema = z.object({
	name: nameValidator,
	defaultRole: z.boolean()
});

export type EditRolePayload = z.infer<typeof EditRoleSchema>;

// Session

export const CreateSessionSchema = z.object({
	name: nameValidator,
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type CreateSessionPayload = z.infer<typeof CreateSessionSchema>;

export const EditSessionSchema = z.object({
	name: nameValidator,
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: dateValidator,
	endDate: dateValidator,
	description: descriptionValidator
});

export type EditSessionPayload = z.infer<typeof EditSessionSchema>;

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

export const AdminEditAttendeeSchema = z.object({
	eventRoleId: z.string().min(1, 'Role is required').max(100, 'Role is too long'),
	permissionRole: z
		.string()
		.min(1, 'Permission Role is required')
		.max(100, 'Permission Role is too long')
});

export type AdminEditAttendeePayload = z.infer<typeof AdminEditAttendeeSchema>;

// Image Upload

export const ImageUploadSchema = z.object({
	image: isBrowser ? z.instanceof(FileList) : z.any()
});

export type ImageUploadPayload = z.infer<typeof ImageUploadSchema>;

// Authentication

export const SignInSchema = z.object({
	email: emailValidator,
	password: passwordValidator
});

export type SignInPayload = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
	email: emailValidator,
	password: passwordValidator,
	name: nameValidator
});

export type SignUpPayload = z.infer<typeof SignUpSchema>;

export const ChangePasswordRequestSchema = z.object({
	email: emailValidator
});

export type ChangePasswordRequestPayload = z.infer<typeof ChangePasswordRequestSchema>;

export const ChangePasswordSchema = z.object({
	password: passwordValidator,
	code: codeValidator
});

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;
