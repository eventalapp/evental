import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseVenueQueryData } from '../../hooks/queries/useVenueQuery';
import { UseDeleteVenueMutationData } from '../../hooks/mutations/useDeleteVenueMutatation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenueQueryData &
	UseDeleteVenueMutationData;

export const DeleteVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { deleteVenueMutation, venue } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!venue) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteVenueMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this venue will be permanently deleted.
						</p>

						<Label htmlFor="confirmDelete">
							Type <span className="font-bold">DELETE</span> to confirm
						</Label>
						<Input {...register('confirmDelete', { required: true })} />
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button type="submit" variant="danger" className="ml-4" disabled={!canSubmit}>
					Delete Venue
				</Button>
			</div>
		</form>
	);
};
