import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { UseDeleteEventMutationData } from '../../hooks/mutations/useDeleteEventMutation';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseDeleteEventMutationData;

export const DeleteEventForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { deleteEventMutation, event } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!event) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteEventMutation.mutate();
			})}
		>
			<div className="mt-3 flex w-full flex-col">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this event will be permanently deleted.
						</p>

						<Label htmlFor="confirmDelete">
							Type <span className="font-bold">DELETE</span> to confirm *
						</Label>
						<Input {...register('confirmDelete')} />
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="danger"
					className="ml-4"
					disabled={!canSubmit || deleteEventMutation.isLoading}
				>
					{deleteEventMutation.isLoading ? <LoadingInner /> : 'Delete Event'}
				</Button>
			</div>
		</form>
	);
};
