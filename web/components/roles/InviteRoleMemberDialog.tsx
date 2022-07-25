import { zodResolver } from '@hookform/resolvers/zod';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Skeleton from 'react-loading-skeleton';

import { useRole } from '@eventalapp/shared/hooks';
import { InviteOrganizerPayload, InviteOrganizerSchema } from '@eventalapp/shared/utils';

import { useInviteRole } from '../../hooks/mutations/useInviteRole';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

interface Props {
	eid: string;
	rid: string;
}

const InviteRoleMemberDialog: React.FC<Props> = (props) => {
	const { eid, rid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const { inviteRoleMutation } = useInviteRole(String(eid), String(rid));
	const { data: role } = useRole({ eid: String(eid), rid: String(rid) });

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteOrganizerPayload>({
		resolver: zodResolver(InviteOrganizerSchema)
	});

	useEffect(() => {
		if (inviteRoleMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [inviteRoleMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					{role ? `Invite ${role.name}` : <Skeleton className="w-full" />}
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					{role ? (
						<>
							Enter the users email that you wish to invite to the{' '}
							<span className="font-medium">"{role.name}"</span> role. They will receive an email
							with information on how to claim their role.
						</>
					) : (
						<Skeleton className="w-full" count={3} />
					)}
				</DialogPrimitive.Description>

				<form
					onSubmit={handleSubmit((data) => {
						inviteRoleMutation.mutate(data);
					})}
				>
					<div className="mt-4">
						<Label htmlFor="name">Email *</Label>
						<Input placeholder="Email" type="email" {...register('email')} autoFocus />
						{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
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

						<Button variant="primary" disabled={inviteRoleMutation.isLoading}>
							{inviteRoleMutation.isLoading ? <LoadingInner /> : 'Invite'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default InviteRoleMemberDialog;
