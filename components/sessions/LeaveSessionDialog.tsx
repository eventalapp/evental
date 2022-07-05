import { Transition } from '@headlessui/react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import cx from 'classnames';
import React, { Fragment, useState } from 'react';

import { useLeaveSession } from '../../hooks/mutations/useLeaveSession';
import { Button } from '../form/Button';

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

			<Transition.Root show={isOpen}>
				<AlertDialogPrimitive.Portal>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<AlertDialogPrimitive.Overlay
							forceMount
							className="fixed inset-0 bg-black/50 z-[10000000000]"
						/>
					</Transition.Child>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<AlertDialogPrimitive.Content
							forceMount
							className={cx(
								'fixed z-50',
								'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
								'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
								'bg-white dark:bg-gray-800',
								'focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75 z-[10000000000]'
							)}
						>
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
						</AlertDialogPrimitive.Content>
					</Transition.Child>
				</AlertDialogPrimitive.Portal>
			</Transition.Root>
		</AlertDialogPrimitive.Root>
	);
};
