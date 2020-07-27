import * as Prisma from '@prisma/client';
import { htmlToText } from 'html-to-text';
import { z } from 'zod';

import { timeZoneList } from './const';
import { isBrowser } from './isBrowser';

const optionalTextInput = (schema: z.ZodString) =>
	z.union([z.string(), z.undefined()]).refine((val) => {
		return !val || schema.safeParse(val).success;
	});

const trimString = (u: unknown) => (typeof u === 'string' ? u.trim() : u);
const noImageTag = (u: unknown) => (typeof u === 'string' ? !u.includes('<img') : u);
const noEmptyString = (u: unknown) => ((u as string | undefined)?.length === 0 ? undefined : u);

const eventMessageSendType = Object.values(Prisma.EventMessageSendType);
const [firstEventMessageSendType, ...restEventMessageSendType] = eventMessageSendType;
const eventTypes = Object.values(Prisma.EventType);
const [firstEventTypes, ...restEventTypes] = eventTypes;
const eventCategory = Object.values(Prisma.EventCategory);
const [firstEventCategory, ...restEventCategory] = eventCategory;
const eventPrivacy = Object.values(Prisma.PrivacyLevel);
const [firstPrivacyLevel, ...restPrivacyLevel] = eventPrivacy;
const [firstTimeZone, ...restTimeZones] = timeZoneList;
const timeZoneValidator = z.enum([firstTimeZone, ...restTimeZones]);

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
		.max(100, 'Organization Name is too long'),
	eventMessageSendType: z.enum([firstEventMessageSendType, ...restEventMessageSendType]),
	privacyLevel: z.enum([firstPrivacyLevel, ...restPrivacyLevel]),
	eventCategory: z.enum([firstEventCategory, ...restEventCategory]),
	eventType: z.enum([firstEventTypes, ...restEventTypes]),
	timeZone: z.enum([firstTimeZone, ...restTimeZones])
};

// Venues

export const CreateVenueSchema = z.object({
	name: validator.name,
	address: validator.address,
	description: validator.description.optional()
});

export type CreateVenuePayload = z.infer<typeof CreateVenueSchema>;

export const EditVenueSchema = z.object({
	name: validator.name,
	address: validator.address,
	description: validator.description.optional()
});

export type EditVenuePayload = z.infer<typeof EditVenueSchema>;

// Role

export const CreateRoleSchema = z.object({
	name: validator.name,
	defaultRole: z.boolean()
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;

export const EditRoleSchema = z.object({
	name: validator.name,
	defaultRole: z.boolean()
});

export type EditRolePayload = z.infer<typeof EditRoleSchema>;

// Session

export const CreateSessionSchema = z.object({
	name: validator.name,
	venueId: validator.venueId,
	startDate: validator.date,
	maxAttendees: z.number().nullable().optional(),
	endDate: validator.date,
	categoryId: validator.typeId,
	description: validator.description.optional(),
	roleMembers: z.string().array()
});

export type CreateSessionPayload = z.infer<typeof CreateSessionSchema>;

export const EditSessionSchema = z.object({
	name: validator.name,
	venueId: validator.venueId,
	startDate: validator.date,
	maxAttendees: z.number().nullable().optional(),
	endDate: validator.date,
	categoryId: validator.typeId,
	description: validator.description.optional()
});

export type EditSessionPayload = z.infer<typeof EditSessionSchema>;

// Session Categories

export const CreateSessionCategorySchema = z.object({
	name: validator.name,
	color: z.string()
});

export type CreateSessionCategoryPayload = z.infer<typeof CreateSessionCategorySchema>;

export const EditSessionCategorySchema = z.object({
	name: validator.name,
	color: z.string()
});

export type EditSessionCategoryPayload = z.infer<typeof EditSessionCategorySchema>;

// Event

export const CreateEventSchema = z.object({
	name: validator.name,
	timeZone: timeZoneValidator,
	startDate: validator.date,
	endDate: validator.date
});

export type CreateEventPayload = z.infer<typeof CreateEventSchema>;

export const EditEventSchema = z.object({
	category: validator.eventCategory,
	slug: validator.slug,
	name: validator.name,
	timeZone: timeZoneValidator,
	location: validator.location.optional(),
	color: z.string(),
	website: validator.url.optional(),
	type: validator.eventType,
	privacy: validator.privacyLevel,
	image: validator.imageFile.optional(),
	startDate: validator.date,
	endDate: validator.date,
	description: validator.description.optional()
});

export type EditEventPayload = z.infer<typeof EditEventSchema>;

// Image Upload

export const ImageUploadSchema = z.object({
	image: z.any()
});

export type ImageUploadPayload = z.infer<typeof ImageUploadSchema>;

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

// Password

export const ChangePasswordRequestSchema = z.object({
	email: validator.email
});

export type ChangePasswordRequestPayload = z.infer<typeof ChangePasswordRequestSchema>;

export const ChangePasswordSchema = z.object({
	password: validator.password,
	code: validator.code
});

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;

// User

export const EditUserSchema = z.object({
	slug: validator.slug,
	name: validator.name,
	image: validator.imageFile.optional(),
	location: validator.location.optional(),
	description: validator.description
		.refine(noImageTag, 'Your description cannot include an image.')
		.optional(),
	company: validator.company.optional(),
	position: validator.position.optional(),
	website: validator.url.optional(),
	email: validator.optionalEmail
});

export type EditUserPayload = z.infer<typeof EditUserSchema>;

export const UserSettingsSchema = z.object({
	slug: validator.slug,
	name: validator.name,
	image: validator.imageFile.optional(),
	location: validator.location.optional(),
	description: validator.description
		.refine(noImageTag, 'Your description cannot include an image.')
		.optional(),
	company: validator.company.optional(),
	position: validator.position.optional(),
	website: validator.url.optional()
});

export type UserSettingsPayload = z.infer<typeof UserSettingsSchema>;

export const NotificationPreferenceSchema = z.object({
	event: z.boolean(),
	marketing: z.boolean(),
	news: z.boolean()
});

export type NotificationPreferencePayload = z.infer<typeof NotificationPreferenceSchema>;

// Invites

export const InviteOrganizerSchema = z.object({
	email: validator.email
});

export type InviteOrganizerPayload = z.infer<typeof InviteOrganizerSchema>;

export const AcceptOrganizerInviteSchema = z.object({
	code: validator.code
});

export type AcceptOrganizerInvitePayload = z.infer<typeof AcceptOrganizerInviteSchema>;

// Pages

export const CreatePageSchema = z.object({
	name: validator.name,
	topLevel: z.boolean(),
	body: validator.description.optional()
});

export type CreatePagePayload = z.infer<typeof CreatePageSchema>;

export const EditPageSchema = z.object({
	name: validator.name,
	topLevel: z.boolean(),
	body: validator.description.optional()
});

export type EditPagePayload = z.infer<typeof EditPageSchema>;

// Invites

export const InviteRoleSchema = z.object({
	email: validator.email
});

export type InviteRolePayload = z.infer<typeof InviteRoleSchema>;

export const AcceptRoleInviteSchema = z.object({
	code: validator.code
});

export type AcceptRoleInvitePayload = z.infer<typeof AcceptRoleInviteSchema>;

// Invites

export const PurchaseProSchema = z.object({
	attendees: z.number().max(5000, 'Too many attendees'),
	eventId: validator.eventId
});

export type PurchaseProPayload = z.infer<typeof PurchaseProSchema>;

// Verification

export const VerifyEmailSchema = z.object({
	code: z.string()
});

export type VerifyEmailPayload = z.infer<typeof VerifyEmailSchema>;

// Admin Create Attendee

export const AdminCreateAttendeeSchema = z.object({
	slug: validator.slug.optional(),
	name: validator.name,
	image: validator.imageFile.optional(),
	location: validator.location.optional(),
	description: validator.description
		.refine(noImageTag, 'Your description cannot include an image.')
		.optional(),
	company: validator.company.optional(),
	position: validator.position.optional(),
	website: validator.url.optional(),
	email: validator.optionalEmail,
	eventRoleId: validator.eventRoleId
});

export type AdminCreateAttendeePayload = z.infer<typeof AdminCreateAttendeeSchema>;

// Claim profile

export const ClaimProfileSchema = z.object({
	password: validator.password,
	code: validator.code
});

export type ClaimProfilePayload = z.infer<typeof ClaimProfileSchema>;

// Add role attendee to session

export const AddAttendeeToSessionSchema = z.object({
	userId: validator.userId
});

export type AddAttendeeToSessionPayload = z.infer<typeof AddAttendeeToSessionSchema>;

// Add role attendee to session

export const RemoveAttendeeFromSessionSchema = z.object({
	userId: validator.userId
});

export type RemoveAttendeeFromSessionPayload = z.infer<typeof RemoveAttendeeFromSessionSchema>;

// Support ticket

export const SubmitSupportTicketSchema = z.object({
	attendanceType: z
		.string()
		.min(1, 'Attendance Type is required')
		.max(100, 'Attendance Type is too long'),
	helpType: z.string().min(1, 'Help Type is required').max(100, 'Help Type is too long'),
	body: z.preprocess((val) => htmlToText(String(val)), validator.body),
	name: validator.name,
	email: validator.email,
	website: validator.url.optional(),
	phoneNumber: validator.phoneNumber
});

export type SubmitSupportTicketPayload = z.infer<typeof SubmitSupportTicketSchema>;

// Demo Request ticket

export const SubmitDemoRequestSchema = z.object({
	body: z.preprocess((val) => htmlToText(String(val)), validator.body),
	organizationName: validator.organizationName,
	name: validator.name,
	email: validator.email,
	phoneNumber: validator.phoneNumber
});

export type SubmitDemoRequestPayload = z.infer<typeof SubmitDemoRequestSchema>;

// Delete data

export const DeleteDataSchema = z.object({
	confirm: z.string().refine((val) => val.toLowerCase() === 'delete', {
		message: `Please type "Delete" to confirm.`
	})
});

export type DeleteDataPayload = z.infer<typeof DeleteDataSchema>;

// Event message

export const SendEventMessageSchema = z.object({
	body: validator.body,
	title: validator.title,
	eventId: validator.eventId,
	sendType: validator.eventMessageSendType,
	roleId: validator.roleId.optional()
});

export type SendEventMessagePayload = z.infer<typeof SendEventMessageSchema>;

export const EditEventMessageSchema = z.object({
	body: validator.body,
	title: validator.title
});

export type EditEventMessagePayload = z.infer<typeof EditEventMessageSchema>;

// Event Attendee

export const AdminEditAttendeeSchema = z.object({
	eventRoleId: validator.eventRoleId,
	permissionRole: z
		.string()
		.min(1, 'Permission Role is required')
		.max(100, 'Permission Role is too long'),
	slug: validator.slug.optional(),
	name: validator.name.optional(),
	image: validator.imageFile.optional(),
	location: validator.location.optional(),
	description: validator.description
		.refine(noImageTag, 'Your description cannot include an image.')
		.optional(),
	company: validator.company.optional(),
	position: validator.position.optional(),
	website: validator.url.optional(),
	email: validator.optionalEmail
});

export type AdminEditAttendeePayload = z.infer<typeof AdminEditAttendeeSchema>;
