import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditVenueMutationData } from '../../hooks/mutations/useEditVenueMutation';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { Textarea } from '../form/Textarea';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenueQueryData &
	UseEditVenueMutationData;

export const EditVenueForm: React.FC<Props> = (props) => {
	const { venue, editVenueMutation } = props;

	if (!venue) return null;

	return (
		<form onSubmit={editVenueMutation.mutate}>
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
