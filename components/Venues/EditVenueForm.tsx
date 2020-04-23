import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { ServerError } from '../ServerError';
import { useEditVenueMutation } from '../../hooks/mutations/useEditVenueMutation';
import { useVenueQuery } from '../../hooks/queries/useVenueQuery';
import { Textarea } from '../Form/Textarea';

interface Props {
	eid: string;
	vid: string;
}

type EditVenueFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditVenueForm: React.FC<EditVenueFormProps> = (props) => {
	const { eid, vid, ...rest } = props;
	const { editVenueMutation, editVenueError } = useEditVenueMutation(String(eid), String(vid));
	const { venue, venueError, isVenueLoading } = useVenueQuery(eid, vid);

	if (editVenueError) {
		return <ServerError error={editVenueError} />;
	}

	if (isVenueLoading) {
		return (
			<div>
				<p>Venue loading...</p>
			</div>
		);
	}

	if (!venue) {
		return (
			<div>
				<p>Venue not found.</p>
			</div>
		);
	}

	if (venueError) {
		return <ServerError error={venueError} />;
	}

	return (
		<form onSubmit={editVenueMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue={venue.name} id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input defaultValue={venue.slug} id="slug" name="slug" type="text" required />
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue={String(venue.description)}
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
