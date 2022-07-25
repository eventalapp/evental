import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useLeaveEvent } from '@eventalapp/shared/hooks';

import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';

interface Props {
	eid: string;
}

const LeaveEventDialog: React.FC<Props> = (props) => {
	const { eid, children } = props;
	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const leaveEventMutation = useLeaveEvent({
		eid,
		onSuccess: () => {
			toast.success('You have left the event');

			void router.push(`/events`);
		},
		onError: (error) => {
			toast.error(error?.message ?? 'An error has occurred.');
		}
	});

	useEffect(() => {
		if (leaveEventMutation.isSuccess) {
			setIsOpen(false);
		}
	}, [leaveEventMutation.isSuccess]);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger type="button" asChild>
				{children}
			</DialogPrimitive.Trigger>
			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Leave this event?
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
					You may rejoin this event, but your session attendance and event permissions will be
					removed.
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
							leaveEventMutation.mutate();
						}}
						disabled={leaveEventMutation.isLoading}
					>
						{leaveEventMutation.isLoading ? <LoadingInner /> : 'Confirm'}
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default LeaveEventDialog;
