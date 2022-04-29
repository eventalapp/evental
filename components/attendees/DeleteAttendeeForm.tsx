import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { UseDeleteAttendeeMutationData } from '../../hooks/mutations/useDeleteAttendeeMutatation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseAttendeeQueryData &
	UseDeleteAttendeeMutationData;

export const DeleteAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { deleteAttendeeMutation, attendee } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!attendee) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteAttendeeMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this attendee will be permanently deleted.
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
					Delete Attendee
				</Button>
			</div>
		</form>
	);
};
