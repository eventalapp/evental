import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { UseDeleteSessionTypeMutationData } from '../../hooks/mutations/useDeleteSessionTypeMutation';
import { UseSessionTypeQueryData } from '../../hooks/queries/useSessionTypeQuery';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseDeleteSessionTypeMutationData &
	UseSessionTypeQueryData;

export const DeleteSessionTypeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { sessionType, deleteSessionTypeMutation } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!sessionType) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deleteSessionTypeMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">
							All of the data regarding this session type will be permanently deleted.
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
					disabled={!canSubmit || deleteSessionTypeMutation.isLoading}
				>
					{deleteSessionTypeMutation.isLoading ? <LoadingInner /> : 'Delete SessionType'}
				</Button>
			</div>
		</form>
	);
};
