import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { UseDeleteSessionMutationData } from '../../hooks/mutations/useDeleteSessionMutation';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseDeleteSessionMutationData &
	UseSessionQueryData;

export const DeleteSessionForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { session, deleteSessionMutation } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!session) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteSessionMutation.mutate();
			})}
		>
			<div className="mt-3 flex w-full flex-col">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this session will be permanently deleted.
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
					disabled={!canSubmit || deleteSessionMutation.isLoading}
				>
					{deleteSessionMutation.isLoading ? <LoadingInner /> : 'Delete Session'}
				</Button>
			</div>
		</form>
	);
};
