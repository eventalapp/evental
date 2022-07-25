import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DeleteDataPayload, DeleteDataSchema } from '@eventalapp/shared/utils';

import { useDeleteMessage } from '../../hooks/mutations/useDeleteMessage';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface Props {
	eid: string;
	mid: string;
}

const DeleteMessageDialog: React.FC<Props> = (props) => {
	const { eid, mid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { deleteMessage } = useDeleteMessage(String(eid), String(mid));
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<DeleteDataPayload>({
		resolver: zodResolver(DeleteDataSchema)
	});

	useEffect(() => {
		if (deleteMessage.isSuccess) {
			setIsOpen(false);
		}
	}, [deleteMessage.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Delete this message?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					After this message is deleted, all data regarding this message will be deleted. But
					recipients will still have this message in their email inbox.
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit(() => {
						deleteMessage.mutate();
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

						<Button variant="danger" disabled={deleteMessage.isLoading}>
							{deleteMessage.isLoading ? <LoadingInner /> : 'Delete'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default DeleteMessageDialog;
