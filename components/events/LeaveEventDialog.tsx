import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import React, { useEffect, useState } from 'react';

import { useLeaveEvent } from '../../hooks/mutations/useLeaveEvent';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';

interface Props {
	eventSlug: string;
	userSlug: string;
}

const LeaveEventDialog: React.FC<Props> = (props) => {
	const { eventSlug, userSlug, children } = props;
	let [isOpen, setIsOpen] = useState(false);

	const leaveEventMutation = useLeaveEvent(eventSlug, String(userSlug));

	useEffect(() => {
		if (!leaveEventMutation.isLoading && leaveEventMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [leaveEventMutation.isLoading]);

	return (
		<AlertDialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogPrimitive.Trigger type="button" asChild>
				{children}
			</AlertDialogPrimitive.Trigger>
			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<AlertDialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Leave this event?
				</AlertDialogPrimitive.Title>
				<AlertDialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					You may rejoin this event, but your session attendance and event permissions will be
					removed.
				</AlertDialogPrimitive.Description>
				<div className="mt-4 flex justify-end space-x-2">
					<Button
						variant="no-bg"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>

					<Button
						variant="danger"
						onClick={() => {
							leaveEventMutation.mutate();
						}}
						disabled={leaveEventMutation.isLoading}
						autoFocus
					>
						{leaveEventMutation.isLoading ? <LoadingInner /> : 'Confirm'}
					</Button>
				</div>
			</DialogContent>
		</AlertDialogPrimitive.Root>
	);
};

export default LeaveEventDialog;
