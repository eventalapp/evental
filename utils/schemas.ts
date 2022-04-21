import isISODate from 'is-iso-date';
import { z } from 'zod';

export const CreateVenueSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	description: z.string().max(1000, 'Description is too long')
});

export const CreateActivitySchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	venueId: z.string().min(1, 'Venue must be specified').max(100, 'Venue is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});

export const CreateEventSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	location: z.string().min(1, 'Location must be specified').max(100, 'Location is too long'),
	startDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	endDate: z.string().refine(isISODate, { message: 'Not a valid ISO string date' }),
	description: z.string().max(1000, 'Description is too long')
});
