import axios from 'axios';
import router from 'next/router';
import { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';
import { getFormEntries } from '../../../utils/getFormEntries';
import { CreateEventPayload, CreateEventSchema } from '../../../utils/schemas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';

type CreateEventFormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateEventForm: React.FC<CreateEventFormProps> = (props) => {
	const { ...rest } = props;

	const createEvent = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = CreateEventSchema.parse(formEntries);

			//TODO: Use react query mutation

			const body: CreateEventPayload = {
				name: eventParsed.name,
				slug: eventParsed.slug,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			};

			const createEventResponse = await axios.post('/api/events/create', body);

			if (createEventResponse.status === 200) {
				router.push(`/events/${createEventResponse.data.slug}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

	return (
		<form onSubmit={createEvent} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue="Event Name" id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							defaultValue="Event Location"
							id="location"
							name="location"
							type="text"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input defaultValue="event-slug" id="slug" name="slug" type="text" required />
					</div>
				</div>
				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue="Event Description"
							id="description"
							name="description"
							type="text"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="startDate">Start Date</Label>
						<Input
							defaultValue={new Date().toISOString()}
							id="startDate"
							name="startDate"
							type="text"
							required
						/>
					</div>
					<div>
						<Label htmlFor="endDate">End Date</Label>
						<Input
							defaultValue={new Date().toISOString()}
							id="endDate"
							name="endDate"
							type="text"
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit">Register Event</Button>
		</form>
	);
};
