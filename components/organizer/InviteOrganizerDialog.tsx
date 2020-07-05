import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useInviteOrganizerMutation } from '../../hooks/mutations/useInviteOrganizerMutation';
import { InviteOrganizerPayload, InviteOrganizerSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { DialogContent } from '../primitives/DialogContent';

interface Props {
	eid: string;
}

const InviteOrganizerDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { inviteOrganizerMutation } = useInviteOrganizerMutation(String(eid));

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteOrganizerPayload>({
		resolver: zodResolver(InviteOrganizerSchema)
	});

	useEffect(() => {
		if (!inviteOrganizerMutation.isLoading && inviteOrganizerMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [inviteOrganizerMutation.isLoading]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Invite an Organizer
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Organizers are able to create, edit, and delete sessions, venues, and roles. Invite an
					organizer to assist you with setting up and managing your event.
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit((data) => {
						inviteOrganizerMutation.mutate(data);
					})}
				>
					<div className="mt-4">
						<Label htmlFor="name">Email *</Label>
						<Input placeholder="Email" type="email" {...register('email')} autoFocus />
						{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
					</div>
					<div className="mt-4 flex justify-end space-x-2">
						<DialogPrimitive.Cancel asChild>
							<Button variant="no-bg">Cancel</Button>
						</DialogPrimitive.Cancel>

						<Button variant="primary" disabled={inviteOrganizerMutation.isLoading}>
							{inviteOrganizerMutation.isLoading ? <LoadingInner /> : 'Invite'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default InviteOrganizerDialog;
