import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useDeletePageMutation } from '../../../hooks/mutations/useDeletePageMutation';
import { DeleteDataPayload, DeleteDataSchema } from '../../../utils/schemas';
import { LoadingInner } from '../../error/LoadingInner';
import { Button } from '../../form/Button';
import { ErrorMessage } from '../../form/ErrorMessage';
import { Input } from '../../form/Input';
import { Label } from '../../form/Label';
import { DialogContent } from './DialogContent';

interface Props {
	eid: string;
	pid: string;
}

const DeletePageDialog: React.FC<Props> = (props) => {
	const { eid, pid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { deletePageMutation } = useDeletePageMutation(String(eid), String(pid));
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<DeleteDataPayload>({
		resolver: zodResolver(DeleteDataSchema)
	});

	useEffect(() => {
		if (!deletePageMutation.isLoading && deletePageMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [deletePageMutation.isLoading]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Delete this page?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					After this page is deleted, all data regarding this page will be deleted.
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit(() => {
						deletePageMutation.mutate();
					})}
				>
					<div className="mt-4">
						<Label htmlFor="confirmDelete">Confirm *</Label>
						<Input
							autoComplete="off"
							placeholder={`Type "Delete" to confirm`}
							{...register('confirm')}
							autoFocus={true}
						/>
						{errors.confirm?.message && <ErrorMessage>{errors.confirm?.message}</ErrorMessage>}
					</div>
					<div className="mt-4 flex justify-end space-x-2">
						<DialogPrimitive.Cancel asChild>
							<Button variant="no-bg">Cancel</Button>
						</DialogPrimitive.Cancel>

						<Button variant="danger" disabled={deletePageMutation.isLoading}>
							{deletePageMutation.isLoading ? <LoadingInner /> : 'Delete'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default DeletePageDialog;
