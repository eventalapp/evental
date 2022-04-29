import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { UseDeleteVenueMutationData } from '../../hooks/mutations/useDeleteVenueMutatation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenueQueryData &
	UseDeleteVenueMutationData;

export const DeleteVenueForm: React.FC<Props> = (props) => {
	const { venue, deleteVenueMutation } = props;
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (!venue) return null;

	return (
		<form onSubmit={deleteVenueMutation.mutate}>
			<div className="flex flex-col w-full mt-5">
				<h1 className="text-2xl mb-3">
					Are you sure you would like to delete venue: {venue.name}?
				</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<p className="font-bold mb-3">Please retype the venue name below ({venue.name}).</p>
						<Label htmlFor="name">Venue Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setCanSubmit(event.target.value === venue.name);
							}}
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit" disabled={!canSubmit}>
				Delete Venue
			</Button>
		</form>
	);
};
