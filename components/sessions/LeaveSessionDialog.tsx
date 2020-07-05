import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useState } from 'react';

import { useLeaveSession } from '../../hooks/mutations/useLeaveSession';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';

interface Props {
	eventSlug: string;
	sessionSlug: string;
	userSlug: string;
	redirect?: boolean;
}

export const LeaveSessionDialog: React.FC<Props> = (props) => {
	const { eventSlug, userSlug, sessionSlug, children, redirect } = props;
	let [isOpen, setIsOpen] = useState(false);

	const leaveSessionMutation = useLeaveSession(eventSlug, sessionSlug, userSlug, { redirect });

	return (
		<AlertDialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogPrimitive.Trigger type="button" asChild>
				{children}
			</AlertDialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<AlertDialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Leave this session?
				</AlertDialogPrimitive.Title>
				<AlertDialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					You may rejoin this session assuming the session is not full.
				</AlertDialogPrimitive.Description>
				<div className="mt-4 flex justify-end space-x-2">
					<AlertDialogPrimitive.Cancel>
						<Button variant="no-bg">Cancel</Button>
					</AlertDialogPrimitive.Cancel>
					<AlertDialogPrimitive.Action>
						<Button
							variant="danger"
							onClick={() => {
								leaveSessionMutation.mutate();
							}}
						>
							Confirm
						</Button>
					</AlertDialogPrimitive.Action>
				</div>
			</DialogContent>
		</AlertDialogPrimitive.Root>
	);
};
