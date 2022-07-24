import { z } from 'zod';

const optionalTextInput = (schema: z.ZodString) =>
	z.union([z.string(), z.undefined()]).refine((val) => {
		return !val || schema.safeParse(val).success;
	});

export const isBrowser = typeof window !== 'undefined';

const trimString = (u: unknown) => (typeof u === 'string' ? u.trim() : u);
const noEmptyString = (u: unknown) => ((u as string | undefined)?.length === 0 ? undefined : u);

const validator = {
	slug: z.preprocess(
		trimString,
		z
			.string()
			.min(1, 'Slug is required.')
			.min(3, 'Slug must be at least 3 characters')
			.max(100, 'Slug must be less than 100 characters')
			.regex(new RegExp(/^(?!-)(?!.*-$).+$/), 'Slug cannot start or end with a hyphen.')
	),
	name: z.preprocess(
		trimString,
		z
			.string()
			.min(1, 'Name is required.')
			.min(3, 'Name must be at least 3 characters')
			.max(100, 'Name must be less than 100 characters')
	),
	address: z.preprocess(
		trimString,
		z.string().max(100, 'Address must be less than 100 characters')
	),
	title: z.preprocess(
		trimString,
		z
			.string()
			.min(1, 'Title is required.')
			.min(3, 'Title must be at least 3 characters')
			.max(100, 'Title must be less than 100 characters')
	),
	date: z.preprocess((val) => (val ? new Date(val as string | Date) : null), z.date()),
	description: z.preprocess(
		trimString,
		z.string().max(5000, 'Description must be less than 5000 characters')
	),
	email: z.preprocess(
		trimString,
		z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email address')
			.max(80, 'Email must be less than 80 characters')
	),
	optionalEmail: z.preprocess(noEmptyString, optionalTextInput(z.string().email())),
	password: z.preprocess(
		trimString,
		z
			.string()
			.min(1, 'Password is required')
			.min(8, 'Password must be at least 8 characters')
			.max(80, 'Password must be less than 80 characters')
	),
	code: z
		.string()
		.min(1, 'Code is required')
		.min(10, 'Code must be at least 10 characters')
		.max(300, 'Code must be less than 300 characters'),
	userId: z.string().min(1, 'User ID is required').max(200, 'User ID is too long'),
	phoneNumber: z.string().max(100, 'Phone Number is too long'),
	imageFile: isBrowser ? z.instanceof(File) : z.any(),
	location: z.string().max(100, 'Location must be less than 70 characters'),
	eventRoleId: z.string().min(1, 'Role ID is required').max(200, 'Role ID is too long'),
	company: z.preprocess(
		trimString,
		z.string().max(100, 'Company must be less than 100 characters')
	),
	position: z.preprocess(
		trimString,
		z.string().max(100, 'Position must be less than 70 characters')
	),
	url: z.string().url().max(200, 'URL must be less than 200 characters').or(z.literal('')),
	venueId: z.preprocess((val) => {
		if (val === 'none') {
			return null;
		}
		return val;
	}, z.string().max(100, 'Venue is too long').nullable()),
	typeId: z.preprocess((val) => {
		if (val === 'none') {
			return null;
		}
		return val;
	}, z.string().max(100, 'Type is too long').nullable()),
	body: z.string().min(1, 'Body is required').max(5000, 'Body is too long'),
	eventId: z.string().min(1, 'Event ID is required').max(200, 'Event ID is too long'),
	roleId: z.string().max(200, 'Role ID is too long'),
	organizationName: z
		.string()
		.min(1, 'Organization Name is required')
		.max(100, 'Organization Name is too long')
};

// Authentication

export const SignInSchema = z.object({
	email: validator.email,
	password: validator.password
});

export type SignInPayload = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
	email: validator.email,
	password: validator.password,
	name: validator.name
});

export type SignUpPayload = z.infer<typeof SignUpSchema>;

// Notification Preferences

export const NotificationPreferenceSchema = z.object({
	event: z.boolean(),
	marketing: z.boolean(),
	news: z.boolean()
});

export type NotificationPreferencePayload = z.infer<typeof NotificationPreferenceSchema>;
