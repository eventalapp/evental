import { Transition } from '@headlessui/react';
import Prisma from '@prisma/client';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import cx from 'classnames';
import Color from 'color';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';

import { useCreateAttendeeMutation } from '../../../hooks/mutations/useCreateAttendeeMutation';
import { StrippedUser } from '../../../utils/stripUser';
import { LoadingInner } from '../../error/LoadingInner';
import { Button } from '../../form/Button';
import { LinkButton } from '../../form/LinkButton';

interface Props {
	event: Prisma.Event;
	user: StrippedUser | undefined;
}

export const CreateAttendeeDialog: React.FC<Props> = (props) => {
	const { children, event, user } = props;

	let [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	const { createAttendeeMutation } = useCreateAttendeeMutation(String(event.slug), {
		redirect: false
	});

	let params = new URLSearchParams();

	params.append('redirectUrl', String(router.asPath));

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

			<Transition.Root show={isOpen}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<DialogPrimitive.Overlay forceMount className="fixed inset-0 z-20 bg-black/50" />
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
					<DialogPrimitive.Content
						forceMount
						className={cx(
							'fixed z-50',
							'w-[95vw] max-w-2xl rounded-lg p-4 md:w-full',
							'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
							'bg-white dark:bg-gray-800',
							'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
						)}
					>
						<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
							Register for {event.name}
						</DialogPrimitive.Title>
						<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
							{user
								? 'To attend this event, please click the register button below.'
								: 'To attend this event, please create an account.'}
						</DialogPrimitive.Description>

						<div className="mt-4 flex flex-row justify-end">
							<Button
								type="button"
								variant="no-bg"
								onClick={() => {
									setIsOpen(false);
								}}
							>
								Cancel
							</Button>
							<DialogPrimitive.Close>
								{user ? (
									<Button
										type="submit"
										className="ml-4"
										variant="primary"
										padding="medium"
										disabled={createAttendeeMutation.isLoading}
										style={{
											backgroundColor: event.color,
											color: Color(event.color).isLight() ? '#000' : '#FFF'
										}}
										onClick={() => {
											createAttendeeMutation.mutate();
										}}
									>
										{createAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
									</Button>
								) : (
									<Link href={`/auth/signin?${params}`} passHref>
										<LinkButton
											type="submit"
											className="ml-4"
											variant="primary"
											padding="medium"
											style={{
												backgroundColor: event.color,
												color: Color(event.color).isLight() ? '#000' : '#FFF'
											}}
										>
											Create Account
										</LinkButton>
									</Link>
								)}
							</DialogPrimitive.Close>
						</div>

						<DialogPrimitive.Close
							className={cx(
								'absolute top-3.5 right-3.5 inline-flex items-center justify-center rounded-full p-1',
								'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
							)}
						>
							<Cross1Icon className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400" />
						</DialogPrimitive.Close>
					</DialogPrimitive.Content>
				</Transition.Child>
			</Transition.Root>
		</DialogPrimitive.Root>
	);
};
