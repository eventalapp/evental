import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useAdminDeleteAttendeeMutation } from '../../hooks/mutations/useAdminDeleteAttendeeMutation';
import { DeleteDataPayload, DeleteDataSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { DialogContent } from '../primitives/DialogContent';

interface Props {
	eid: string;
	uid: string;
}

const DeleteAttendeeDialog: React.FC<Props> = (props) => {
	const { eid, uid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { adminDeleteAttendeeMutation } = useAdminDeleteAttendeeMutation(String(eid), String(uid));
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<DeleteDataPayload>({
		resolver: zodResolver(DeleteDataSchema)
	});

	useEffect(() => {
		if (!adminDeleteAttendeeMutation.isLoading && adminDeleteAttendeeMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [adminDeleteAttendeeMutation.isLoading]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Delete this attendee?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					After this attendee is deleted, all data regarding this attendee will be deleted.
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit(() => {
						adminDeleteAttendeeMutation.mutate();
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

						<Button variant="danger" disabled={adminDeleteAttendeeMutation.isLoading}>
							{adminDeleteAttendeeMutation.isLoading ? <LoadingInner /> : 'Delete'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default DeleteAttendeeDialog;
