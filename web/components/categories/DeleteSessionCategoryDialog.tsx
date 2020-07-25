import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DeleteDataPayload, DeleteDataSchema } from '@eventalapp/shared/utils';

import { useDeleteSessionCategory } from '../../hooks/mutations/useDeleteSessionCategory';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface Props {
	eid: string;
	cid: string;
}

const DeleteSessionCategoryDialog: React.FC<Props> = (props) => {
	const { eid, cid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { deleteSessionCategoryMutation } = useDeleteSessionCategory(String(eid), String(cid));
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<DeleteDataPayload>({
		resolver: zodResolver(DeleteDataSchema)
	});

	useEffect(() => {
		if (deleteSessionCategoryMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [deleteSessionCategoryMutation.isSuccess]);

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
						<Button
							variant="no-bg"
							onClick={() => {
								setIsOpen(false);
							}}
						>
							Cancel
						</Button>

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
