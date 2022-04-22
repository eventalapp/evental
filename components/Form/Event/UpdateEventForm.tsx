import axios from 'axios';
import router from 'next/router';
import { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';
import { useEventQuery } from '../../../hooks/useEventQuery';
import { getFormEntries } from '../../../utils/getFormEntries';
import { UpdateEventSchema } from '../../../utils/schemas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';

interface Props {
	eid: string;
}

type UpdateEventFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const UpdateEventForm: React.FC<UpdateEventFormProps> = (props) => {
	const { eid, ...rest } = props;
	const { event, isEventLoading } = useEventQuery(eid);

	const updateEvent = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = UpdateEventSchema.parse(formEntries);

			//TODO: Use react query mutation

			const updateEventResponse = await axios.put(`/api/events/${eid}/admin/edit`, {
				name: eventParsed.name,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			});

			if (updateEventResponse.status === 200) {
				router.push(`/events/${updateEventResponse.data.id}`);
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

	return (
		<form onSubmit={updateEvent} {...rest}>
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

			<Button type="submit">Update Event</Button>
		</form>
	);
};
