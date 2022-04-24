import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Textarea } from '../Form/Textarea';
import { useCreateEventMutation } from '../../hooks/mutations/useCreateEventMutation';
import { ServerError } from '../ServerError';

type CreateEventFormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateEventForm: React.FC<CreateEventFormProps> = (props) => {
	const { ...rest } = props;
	const { createEventMutation, createEventError } = useCreateEventMutation();

	if (createEventError) {
		return <ServerError errors={[createEventError]} />;
	}

	return (
		<form onSubmit={createEventMutation.mutate} {...rest}>
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
