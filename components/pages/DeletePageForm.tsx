import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UsePageQueryData } from '../../hooks/queries/usePageQuery';
import { UseDeletePageMutationData } from '../../hooks/mutations/useDeletePageMutation';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { LoadingInner } from '../error/LoadingInner';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UsePageQueryData &
	UseDeletePageMutationData;

export const DeletePageForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { deletePageMutation, page } = props;
	const { register, handleSubmit, watch } = useForm<{ confirmDelete: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);

	const confirmDeleteWatcher = watch('confirmDelete');

	useEffect(() => {
		setCanSubmit(confirmDeleteWatcher === 'DELETE');
	}, [confirmDeleteWatcher]);

	if (!page) return null;

	return (
		<form
			onSubmit={handleSubmit(() => {
				deletePageMutation.mutate();
			})}
		>
			<div className="flex flex-col w-full mt-3">
				<div className="mb-5">
					<div>
						<p className="mb-3">All of the data regarding this page will be permanently deleted.</p>

						<Label htmlFor="confirmDelete">
							Type <span className="font-bold">DELETE</span> to confirm
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
					disabled={!canSubmit || deletePageMutation.isLoading}
				>
					{deletePageMutation.isLoading ? <LoadingInner /> : 'Delete Page'}
				</Button>
			</div>
		</form>
	);
};
