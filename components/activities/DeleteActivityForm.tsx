import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseActivityQueryData } from '../../hooks/queries/useActivityQuery';
import { UseDeleteActivityMutationData } from '../../hooks/mutations/useDeleteActivityMutation';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseDeleteActivityMutationData &
	UseActivityQueryData;

export const DeleteActivityForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { activity, deleteActivityMutation } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (!activity) return null;

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteActivityMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this activity will be permanently deleted.
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
					Delete Activity
				</Button>
			</div>
		</form>
	);
};
