import axios from 'axios';
import router from 'next/router';
import React, { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';
import { getFormEntries } from '../../utils/getFormEntries';
import { EditEventPayload, EditEventSchema } from '../../utils/schemas';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Textarea } from '../Form/Textarea';
import { useEventQuery } from '../../hooks/queries/useEventQuery';
import { ServerError } from '../ServerError';

interface Props {
	eid: string;
}

type EditEventFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditEventForm: React.FC<EditEventFormProps> = (props) => {
	const { eid, ...rest } = props;
	const { event, isEventLoading, eventError } = useEventQuery(eid);

	const editEvent = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = EditEventSchema.parse(formEntries);

			//TODO: Use react query mutation

			const body: EditEventPayload = {
				name: eventParsed.name,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			};

			const editEventResponse = await axios.put(`/api/events/${eid}/admin/edit`, body);

			if (editEventResponse.status === 200) {
				void router.push(`/events/${editEventResponse.data.id}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

	if (isEventLoading) {
		return (
			<div>
				<p>Events loading...</p>
			</div>
		);
	}

	if (!event) {
		return (
			<div>
				<p>Event not found.</p>
			</div>
		);
	}

	if (eventError) {
		return <ServerError error={eventError} />;
	}

	return (
		<form onSubmit={editEvent} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue={event.name} id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							defaultValue={event.location}
							id="location"
							name="location"
							type="text"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue={String(event.description)}
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
							defaultValue={String(event.startDate)}
							id="startDate"
							name="startDate"
							type="text"
							required
						/>
					</div>
					<div>
						<Label htmlFor="endDate">End Date</Label>
						<Input
							defaultValue={String(event.endDate)}
							id="endDate"
							name="endDate"
							type="text"
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit">Edit Event</Button>
		</form>
	);
};
