import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { useRoles } from '@eventalapp/shared/hooks';

import { DialogContent } from '../primitives/DialogContent';
import { AdminCreateAttendeeForm } from './AdminCreateAttendeeForm';

interface Props {
	eid: string;
}

export const CreateAttendeeDialog: React.FC<Props> = (props) => {
	const { children, eid } = props;
	const { data: roles } = useRoles({ eid: String(eid) });
	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	let params = new URLSearchParams();

	params.append('redirectUrl', String(router.asPath));

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger asChild type="button">
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen} size="2xl">
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Create Attendee
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					Fill out the form below to create an attendee.
				</DialogPrimitive.Description>

				{roles && (
					<AdminCreateAttendeeForm
						eid={eid}
						roles={roles}
						onCancel={() => {
							setIsOpen(false);
						}}
						onSuccess={() => {
							setIsOpen(false);
						}}
						redirect={false}
					/>
				)}
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
