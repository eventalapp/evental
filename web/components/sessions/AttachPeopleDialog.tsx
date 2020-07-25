import { faPlus } from '@fortawesome/free-solid-svg-icons';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import Image from 'next/image';
import React, { useState } from 'react';

import { useAttendeesByName } from '@eventalapp/shared/hooks';

import { CreateAttendeeDialog } from '../attendees/CreateAttendeeDialog';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';
import { DialogContent } from '../primitives/DialogContent';
import { IconButtonTooltip } from '../primitives/IconButtonTooltip';
import { Input } from '../primitives/Input';

interface Props {
	eid: string;
	addAttendeeToSession: (userId: string) => void;
	attachedUsersById?: string[];
}

const AttachPeopleDialog: React.FC<Props> = (props) => {
	const { eid, children, addAttendeeToSession, attachedUsersById } = props;

	let [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');

	const { data: attendeesByName, isLoading: isAttendeesByNameLoading } = useAttendeesByName({
		eid,
		name,
		limit: 8
	});

	const filteredAttendees = attendeesByName?.filter((val) => {
		return !attachedUsersById?.some((userId) => userId === val.userId);
	});

	return (
		<DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
			<DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>

			<DialogContent isOpen={isOpen} setIsOpen={setIsOpen}>
				<DialogPrimitive.Title className="text-xl font-bold text-gray-900 dark:text-gray-100">
					Attach People
				</DialogPrimitive.Title>
				<DialogPrimitive.Description className="mt-2 text-sm font-normal text-gray-600 dark:text-gray-400">
					Search for users in the field below to attach them to this session.
				</DialogPrimitive.Description>
				<div className="my-3 border-b border-gray-300" />

				<form
					className="mb-3 space-y-2"
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
						<Input
							id="firstName"
							type="text"
							placeholder="Type a name"
							autoComplete="given-name"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						/>
						<p className="my-1 text-sm text-gray-600">
							Don't see who you're looking for?{' '}
							<CreateAttendeeDialog eid={String(eid)}>
								<a className="cursor-pointer font-medium">Create an attendee</a>
							</CreateAttendeeDialog>
						</p>
					</fieldset>
				</form>

				<p className="mb-2 font-medium">
					Results <span className="text-gray-500">({filteredAttendees?.length || 0})</span>
				</p>
				<div className="space-y-2">
					{isAttendeesByNameLoading ? (
						<div>
							<LoadingInner />
						</div>
					) : filteredAttendees && filteredAttendees.length >= 1 ? (
						filteredAttendees.map((attendee) => (
							<div
								key={attendee.id}
								className="flex w-full flex-row flex-wrap items-center justify-between"
							>
								<div className="flex items-center">
									<div className="relative h-12 w-12 rounded-md border border-gray-200 shadow-sm">
										<Image
											alt={String(attendee.user.name)}
											src={String(
												attendee?.user.image
													? `https://cdn.evental.app${attendee?.user.image}`
													: `https://cdn.evental.app/images/default-avatar.jpg`
											)}
											className="rounded-md"
											layout="fill"
										/>
									</div>
									<div className="ml-3 flex flex-col">
										<p className="leading-tight">{attendee.user.name}</p>
										<p className="text-sm leading-tight text-gray-600">{attendee.role.name}</p>
									</div>
								</div>

								<IconButtonTooltip
									icon={faPlus}
									message="Add this user to this session."
									onClick={() => {
										addAttendeeToSession(attendee.user.id);
									}}
								/>
							</div>
						))
					) : (
						<p className="text-gray-600">No people found.</p>
					)}
				</div>

				<div className="mt-4 flex justify-end">
					<Button
						type="button"
						variant="primary"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Done
					</Button>
				</div>
			</DialogContent>
		</DialogPrimitive.Root>
	);
};

export default AttachPeopleDialog;
