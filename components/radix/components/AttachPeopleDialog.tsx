import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Transition } from '@headlessui/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross1Icon } from '@radix-ui/react-icons';
import * as Portal from '@radix-ui/react-portal';
import cx from 'classnames';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import { useAddAttendeeToSessionMutation } from '../../../hooks/mutations/useAddAttendeeToSessionMutation';
import { useAttendeesByNameQuery } from '../../../hooks/queries/useAttendeesByNameQuery';
import { LoadingInner } from '../../error/LoadingInner';
import Tooltip from './Tooltip';

interface Props {
	eid: string;
	sid: string;
}

const AttachPeopleDialog = (props: Props) => {
	const { eid, sid } = props;

	let [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');

	const attendeesByNameQuery = useAttendeesByNameQuery(eid, name, { limit: 7 });

	const { addAttendeeToSessionMutation } = useAddAttendeeToSessionMutation(
		String(eid),
		String(sid)
	);

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger>
				<button className="flex items-center justify-center">
					<Tooltip message="Click to attach people to this session">
						<div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
							<FontAwesomeIcon
								fill="currentColor"
								className="h-5 w-5 text-gray-800"
								size="1x"
								icon={faPlus}
							/>
						</div>
					</Tooltip>
				</button>
			</DialogPrimitive.Trigger>

			<Portal.Root>
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
								'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
								'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
								'bg-white dark:bg-gray-800',
								'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
							)}
						>
							<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
								Attach People
							</DialogPrimitive.Title>
							<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-400">
								Search for users in the field below to attach them to this session.
							</DialogPrimitive.Description>
							<div className="border-b border-gray-300 my-3" />

							<form
								className=" space-y-2 mb-3"
								onSubmit={() => {
									setIsOpen(false);
								}}
							>
								<fieldset>
									<label
										htmlFor="firstName"
										className="text-xs font-medium text-gray-700 dark:text-gray-400"
									>
										Name
									</label>
									<input
										id="firstName"
										type="text"
										placeholder="Type a name"
										autoComplete="given-name"
										onChange={(e) => setName(e.target.value)}
										className={cx(
											'mt-1 block w-full rounded-md',
											'text-sm text-gray-700 placeholder:text-gray-500 dark:text-gray-400 dark:placeholder:text-gray-600',
											'border border-gray-400 focus-visible:border-transparent dark:border-gray-700 dark:bg-gray-800',
											'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
										)}
									/>
								</fieldset>
							</form>

							<p className="font-medium mb-2">
								Results{' '}
								<span className="text-gray-500">({attendeesByNameQuery?.data?.length || 0})</span>
							</p>
							<div className="space-y-2">
								{attendeesByNameQuery.isLoading ? (
									<div>
										<LoadingInner />
									</div>
								) : attendeesByNameQuery &&
								  attendeesByNameQuery.data &&
								  attendeesByNameQuery.data.length >= 1 ? (
									Array.from(attendeesByNameQuery.data).map((attendee) => (
										<div
											key={attendee.id}
											className="flex justify-between items-center flex-row flex-wrap w-full"
										>
											<div className="flex items-center">
												<div className="h-12 w-12 relative border-2 border-gray-100 rounded-full">
													<Image
														alt={String(attendee.user.name)}
														src={String(
															attendee?.user.image
																? `https://cdn.evental.app${attendee?.user.image}`
																: `https://cdn.evental.app/images/default-avatar.jpg`
														)}
														className="rounded-full"
														layout="fill"
													/>
												</div>
												<div className="flex flex-col ml-3">
													<p className="leading-tight">{attendee.user.name}</p>
													<p className="text-gray-600 text-sm leading-tight">
														{attendee.role.name}
													</p>
												</div>
											</div>{' '}
											<Tooltip side={'top'} message={`Add this user to this session.`}>
												<button
													type="button"
													className="p-1"
													onClick={() => {
														addAttendeeToSessionMutation.mutate({ userId: attendee.user.id });
														setIsOpen(false);
													}}
												>
													<FontAwesomeIcon
														fill="currentColor"
														className="w-5 h-5 cursor-pointer text-gray-700"
														size="lg"
														icon={faPlus}
													/>
												</button>
											</Tooltip>
										</div>
									))
								) : (
									<p>No people found.</p>
								)}
							</div>

							<div className="mt-4 flex justify-end">
								<DialogPrimitive.Close
									type="submit"
									className={cx(
										'inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium',
										'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:text-gray-100 dark:hover:bg-primary-600',
										'border border-transparent',
										'focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75'
									)}
								>
									Done
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
			</Portal.Root>
		</DialogPrimitive.Root>
	);
};

export default AttachPeopleDialog;
