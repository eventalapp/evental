import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Textarea } from '../Form/Textarea';
import { useEventQuery } from '../../hooks/queries/useEventQuery';
import { ServerError } from '../ServerError';
import { useEditEventMutation } from '../../hooks/mutations/useEditEventMutation';

interface Props {
	eid: string;
}

type EditEventFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditEventForm: React.FC<EditEventFormProps> = (props) => {
	const { eid, ...rest } = props;
	const { event, isEventLoading, eventError } = useEventQuery(eid);
	const { editEventMutation, editEventError } = useEditEventMutation(eid);

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

	if (editEventError) {
		return <ServerError error={editEventError} />;
	}

	return (
		<form onSubmit={editEventMutation.mutate} {...rest}>
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
