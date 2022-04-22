import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Textarea } from '../Form/Textarea';
import { useCreateVenueMutation } from '../../hooks/mutations/useCreateVenueMutation';
import { ServerError } from '../ServerError';

interface Props {
	eid: string;
}

type CreateActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateVenueForm: React.FC<CreateActivityFormProps> = (props) => {
	const { eid, ...rest } = props;
	const { createVenueMutation, createVenueError } = useCreateVenueMutation(eid);

	if (createVenueError) {
		return <ServerError error={createVenueError} />;
	}

	return (
		<form onSubmit={createVenueMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue="Venue Name" id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input defaultValue="venue-slug" id="slug" name="slug" type="text" required />
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue="Venue Description"
							id="description"
							name="description"
							type="text"
						/>
					</div>
				</div>
			</div>

			<Button type="submit">Create Venue</Button>
		</form>
	);
};
