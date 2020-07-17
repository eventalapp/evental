import * as DialogPrimitive from '@radix-ui/react-dialog';
import React, { useEffect, useState } from 'react';

import { useLeaveSession } from '../../hooks/mutations/useLeaveSession';
import { LoadingInner } from '../error/LoadingInner';
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

	useEffect(() => {
		if (leaveSessionMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [leaveSessionMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Leave this session?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					You may rejoin this session assuming the session is not full.
				</DialogPrimitive.Description>
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
							leaveSessionMutation.mutate();
						}}
						disabled={leaveSessionMutation.isLoading}
						autoFocus
					>
						{leaveSessionMutation.isLoading ? <LoadingInner /> : 'Confirm'}
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};
