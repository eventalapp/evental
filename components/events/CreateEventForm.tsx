import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseCreateEventMutationData } from '../../hooks/mutations/useCreateEventMutation';
import { ServerError } from '../ServerError';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseCreateEventMutationData;

export const CreateEventForm: React.FC<Props> = (props) => {
	const { createEventMutation, createEventError } = props;

	if (createEventError) {
		return <ServerError errors={[createEventError]} />;
	}

	return (
		<form onSubmit={createEventMutation.mutate}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Event name" id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							placeholder="Event location"
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
						<Input placeholder="event-slug" id="slug" name="slug" type="text" required />
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							placeholder="Event description"
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

			<div className="flex flex-row justify-end">
				<Button type="submit" variant="gradient">
					Register Event
				</Button>
			</div>
		</form>
	);
};
