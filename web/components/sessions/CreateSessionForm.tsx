import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
	CreateSessionPayload,
	CreateSessionSchema,
	FIFTEEN_MINUTES,
	SessionCategoryWithCount,
	copy
} from '@eventalapp/shared/utils';
import { NEAREST_MINUTE } from '@eventalapp/shared/utils/config';

import { useCreateSession } from '../../hooks/mutations/useCreateSession';
import CreateCategoryDialog from '../categories/CreateCategoryDialog';
import { LoadingInner } from '../error/LoadingInner';
import { DatePicker } from '../form/DatePicker';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { TimeZoneNotice } from '../form/TimeZoneNotice';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Select from '../primitives/Select';
import Tooltip from '../primitives/Tooltip';
import CreateVenueDialog from '../venues/CreateVenueDialog';
import AttachPeopleDialog from './AttachPeopleDialog';
import { RoleMemberListItem } from './RoleMemberListItem';

type Props = {
	eid: string;
	venues: Prisma.EventVenue[];
	sessionCategories: SessionCategoryWithCount[];
	event: Prisma.Event;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateSessionForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { eid, venues, event, sessionCategories } = props;
	const { createSessionMutation } = useCreateSession(String(eid));
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors }
	} = useForm<CreateSessionPayload>({
		defaultValues: {
			venueId: venues?.[0]?.id ?? 'none',
			categoryId: sessionCategories?.[0]?.id ?? 'none',
			startDate: dayjs(event?.startDate).startOf('day').add(8, 'hours').startOf('hour').toDate(),
			endDate: dayjs(event?.startDate).startOf('day').add(9, 'hours').startOf('hour').toDate(),
			roleMembers: []
		},
		resolver: zodResolver(CreateSessionSchema)
	});

	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');
	const roleMembersWatcher = watch('roleMembers');

	useEffect(() => {
		if (startDateWatcher.getTime() + FIFTEEN_MINUTES > endDateWatcher.getTime()) {
			setValue('endDate', dayjs(startDateWatcher).add(1, 'hour').toDate());
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() + FIFTEEN_MINUTES > endDateWatcher.getTime()) {
			setValue('startDate', dayjs(endDateWatcher).subtract(1, 'hour').toDate());
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	if (!venues || !event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createSessionMutation.mutate(data);
			})}
		>
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Session name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">
						Max Attendees *
						<HelpTooltip message={copy.tooltip.maxAttendees} />
					</Label>
					<Input
						placeholder="No Limit"
						type="number"
						{...register('maxAttendees', {
							setValueAs: (v) => (v === '' ? null : parseInt(v, 10))
						})}
					/>
					{errors.maxAttendees?.message && (
						<ErrorMessage>{errors.maxAttendees?.message}</ErrorMessage>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="categoryId">
						Category
						<HelpTooltip message={copy.tooltip.category} />
					</Label>

					<Controller
						control={control}
						name="categoryId"
						render={({ field }) => (
							<Select
								options={[
									{ label: 'No Category', value: 'none' },
									...Object.values(sessionCategories || []).map((sessionCategory) => ({
										label: sessionCategory.name,
										value: sessionCategory.id
									}))
								]}
								value={field.value as string}
								onValueChange={(value) => {
									setValue('categoryId', value);
								}}
							/>
						)}
					/>
					<CreateCategoryDialog eid={String(eid)}>
						<span className="mt-1 cursor-pointer text-sm text-gray-600">
							Dont see your category? Create a category
						</span>
					</CreateCategoryDialog>

					{errors.categoryId?.message && <ErrorMessage>{errors.categoryId?.message}</ErrorMessage>}
				</div>
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="venueId">
						Venue
						<HelpTooltip message={copy.tooltip.venue} />
					</Label>

					<Controller
						control={control}
						name="venueId"
						render={({ field }) => (
							<Select
								options={[
									{ label: 'No Venue', value: 'none' },
									...Object.values(venues).map((venue) => ({
										label: venue.name,
										value: venue.id
									}))
								]}
								value={field.value as string}
								onValueChange={(value) => {
									setValue('venueId', value);
								}}
							/>
						)}
					/>
					<CreateVenueDialog eid={String(eid)}>
						<span className="mt-1 cursor-pointer text-sm text-gray-600">
							Dont see your venue? Create a Venue
						</span>
					</CreateVenueDialog>

					{errors.venueId?.message && <ErrorMessage>{errors.venueId?.message}</ErrorMessage>}
				</div>
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="startDate">Start Date *</Label>
					<div className="relative">
						<Controller
							control={control}
							name="startDate"
							render={({ field }) => (
								<DatePicker
									onChange={(e) => field.onChange(e)}
									selected={field.value}
									startDate={field.value}
									required
									endDate={endDateWatcher}
									selectsStart
									timeIntervals={NEAREST_MINUTE}
									dateFormat="MM/dd/yyyy h:mm a"
									formatTime="DD/MM/YYYY h:mm a"
									showTimeSelect
									maxDate={new Date(String(event.endDate))}
									minDate={new Date(String(event.startDate))}
								/>
							)}
						/>
					</div>
					{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
					<TimeZoneNotice timeZone={event.timeZone} date={startDateWatcher} />
				</div>
				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="endDate">End Date *</Label>
					<div className="relative">
						<Controller
							control={control}
							name="endDate"
							render={({ field }) => (
								<DatePicker
									onChange={(e) => field.onChange(e)}
									selected={field.value}
									selectsEnd
									required
									startDate={startDateWatcher}
									timeIntervals={NEAREST_MINUTE}
									endDate={field.value}
									dateFormat="MM/dd/yyyy h:mm a"
									formatTime="DD/MM/YYYY h:mm a"
									showTimeSelect
									maxDate={new Date(String(event.endDate))}
									minDate={new Date(String(event.startDate))}
								/>
							)}
						/>
					</div>
					{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
					<TimeZoneNotice timeZone={event.timeZone} date={endDateWatcher} />
				</div>
				<div className="col-span-4">
					<Label htmlFor="description">Description</Label>
					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<StyledEditor
								imageUpload
								onChange={(value) => {
									field.onChange(value);
								}}
								content={field.value || ''}
							/>
						)}
					/>
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>

				<div className="col-span-4">
					<Label>
						Attach People
						<HelpTooltip message={copy.tooltip.attachPeople} />
					</Label>

					<ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
						{roleMembersWatcher?.map((userId) => (
							<RoleMemberListItem
								key={userId}
								eid={String(eid)}
								userId={userId}
								removeRoleMember={(userId) => {
									toast.success('The user has been removed from the session');
									setValue(
										'roleMembers',
										roleMembersWatcher.filter((roleMemberUserId) => roleMemberUserId !== userId)
									);
								}}
							/>
						))}

						<div className="flex h-full w-full items-center justify-center">
							<AttachPeopleDialog
								attachedUsersById={roleMembersWatcher}
								eid={String(eid)}
								addAttendeeToSession={(userId) => {
									if (roleMembersWatcher.indexOf(userId) === -1) {
										toast.success('The user has been added to the session');
										setValue('roleMembers', [...roleMembersWatcher, userId]);
									}
								}}
							>
								<button type="button">
									<Tooltip message="Attach people to this session">
										<div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-gray-800 transition-colors duration-200 hover:text-primary-500">
											<FontAwesomeIcon
												fill="currentColor"
												className="h-5 w-5"
												size="1x"
												icon={faPlus}
											/>
										</div>
									</Tooltip>
								</button>
							</AttachPeopleDialog>
						</div>
					</ul>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={createSessionMutation.isLoading}
				>
					{createSessionMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
