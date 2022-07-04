import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useDeleteSessionCategoryMutation } from '../../../hooks/mutations/useDeleteSessionCategoryMutation';
import { DeleteDataPayload, DeleteDataSchema } from '../../../utils/schemas';
import { LoadingInner } from '../../error/LoadingInner';
import { Button } from '../../form/Button';
import { ErrorMessage } from '../../form/ErrorMessage';
import { Input } from '../../form/Input';
import { Label } from '../../form/Label';
import { DialogContent } from './DialogContent';

interface Props {
	eid: string;
	cid: string;
}

const DeleteSessionCategoryDialog: React.FC<Props> = (props) => {
	const { eid, cid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { deleteSessionCategoryMutation } = useDeleteSessionCategoryMutation(
		String(eid),
		String(cid)
	);
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<DeleteDataPayload>({
		resolver: zodResolver(DeleteDataSchema)
	});

	useEffect(() => {
		if (!deleteSessionCategoryMutation.isLoading && deleteSessionCategoryMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [deleteSessionCategoryMutation.isLoading]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Delete this session category?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					After this session category is deleted, all data regarding this session category
					(including all sessions in this category) will be deleted.
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit(() => {
						deleteSessionCategoryMutation.mutate();
					})}
				>
					<div className="mt-4">
						<Label htmlFor="confirmDelete">Confirm *</Label>
						<Input
							autoComplete="off"
							placeholder={`Type "Delete" to confirm`}
							{...register('confirm')}
							autoFocus
						/>
						{errors.confirm?.message && <ErrorMessage>{errors.confirm?.message}</ErrorMessage>}
					</div>
					<div className="mt-4 flex justify-end space-x-2">
						<DialogPrimitive.Cancel asChild>
							<Button variant="no-bg">Cancel</Button>
						</DialogPrimitive.Cancel>

						<Button variant="danger" disabled={deleteSessionCategoryMutation.isLoading}>
							{deleteSessionCategoryMutation.isLoading ? <LoadingInner /> : 'Delete'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default DeleteSessionCategoryDialog;
