import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { NEAREST_MINUTE } from '../../config';
import { UseEditSessionMutationData } from '../../hooks/mutations/useEditSessionMutation';
import { useRemoveAttendeeFromSessionMutation } from '../../hooks/mutations/useRemoveAttendeeFromSessionMutation';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseSessionCategoriesQueryData } from '../../hooks/queries/useSessionCategoriesQuery';
import { UseSessionQueryData } from '../../hooks/queries/useSessionQuery';
import { UseSessionRoleAttendeesQueryData } from '../../hooks/queries/useSessionRoleAttendeesQuery';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { FIFTEEN_MINUTES, copy } from '../../utils/const';
import { EditSessionPayload, EditSessionSchema } from '../../utils/schemas';
import { capitalizeFirstLetter } from '../../utils/string';
import { HelpTooltip } from '../HelpTooltip';
import { TimeZoneNotice } from '../TimeZoneNotice';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { DatePicker } from '../form/DatePicker';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import AttachPeopleDialog from '../radix/components/AttachPeopleDialog';
import CreateCategoryDialog from '../radix/components/CreateCategoryDialog';
import CreateVenueDialog from '../radix/components/CreateVenueDialog';
import Select from '../radix/components/Select';
import Tooltip from '../radix/components/Tooltip';

type Props = {
	eid: string;
	sid: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenuesQueryData &
	UseEditSessionMutationData &
	UseSessionQueryData &
	UseEventQueryData &
	UseSessionCategoriesQueryData &
	UseSessionRoleAttendeesQueryData;

export const EditSessionForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const {
		eid,
		sid,
		venues,
		editSessionMutation,
		session,
		event,
		sessionCategories,
		sessionRoleAttendeesQuery
	} = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors }
	} = useForm<EditSessionPayload>({
		defaultValues: {
			name: String(session?.name),
			description: session?.description ?? undefined,
			venueId: session?.venueId ?? 'none',
			categoryId: session?.categoryId ?? 'none',
			maxAttendees: session?.maxAttendees ?? undefined,
			startDate: session?.startDate ? new Date(String(session?.startDate)) : new Date(),
			endDate: session?.endDate ? new Date(String(session?.endDate)) : new Date()
		},
		resolver: zodResolver(EditSessionSchema)
	});

	const { removeAttendeeFromSessionMutation } = useRemoveAttendeeFromSessionMutation(
		String(eid),
		String(sid)
	);

	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	useEffect(() => {
		if (startDateWatcher.getTime() + FIFTEEN_MINUTES > endDateWatcher.getTime()) {
			setValue('endDate', new Date(startDateWatcher.getTime() + FIFTEEN_MINUTES));
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() + FIFTEEN_MINUTES > endDateWatcher.getTime()) {
			setValue('startDate', new Date(endDateWatcher.getTime() - FIFTEEN_MINUTES));
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	if (!event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editSessionMutation.mutate(data);
			})}
		>
			<div className="mt-5 flex w-full flex-col">
				<div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Session name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="venueId">
							Venue *<HelpTooltip message={copy.tooltip.venue} />
						</Label>

						<Controller
							control={control}
							name="venueId"
							render={({ field }) => (
								<Select
									options={[
										{ label: 'No Venue', value: 'none' },
										...Object.values(venues || []).map((venue) => ({
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
				</div>

				<div className="mb-5">
					<div>
						<Label htmlFor="venueId">
							Attach People *<HelpTooltip message={copy.tooltip.attachPeople} />
						</Label>

						<ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
							{sessionRoleAttendeesQuery?.data?.map((attendee) => (
								<li
									key={attendee.id}
									className="relative flex h-full flex-col items-center justify-between"
								>
									<Link href={`/events/${eid}/admin/attendees/${attendee.user.slug}`}>
										<a className="flex h-full flex-col items-center justify-start">
											<div className="relative mb-1 h-16 w-16 rounded-md border border-gray-200 shadow-sm">
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
											<span className="text-center text-lg">{attendee.user.name}</span>
											<span className="block text-sm leading-none text-gray-700">
												{capitalizeFirstLetter(String(attendee.role.name).toLowerCase())}
											</span>
										</a>
									</Link>

									<div className="absolute -top-1 -right-1">
										<Tooltip side={'top'} message={`Remove this user from this session.`}>
											<button
												type="button"
												className="p-1"
												onClick={() => {
													removeAttendeeFromSessionMutation.mutate({ userId: attendee.user.id });
												}}
											>
												<FontAwesomeIcon
													fill="currentColor"
													className="h-5 w-5 cursor-pointer text-gray-700 transition-colors duration-200 hover:text-red-500"
													size="lg"
													icon={faXmark}
												/>
											</button>
										</Tooltip>
									</div>
								</li>
							))}

							<div className="flex h-full w-full items-center justify-center">
								<AttachPeopleDialog eid={String(eid)} sid={String(sid)}>
									<button type="button">
										<Tooltip message="Click to attach people to this session">
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

				<div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<Label htmlFor="venueId">
							Type *<HelpTooltip message={copy.tooltip.type} />
						</Label>

						<Controller
							control={control}
							name="categoryId"
							render={({ field }) => (
								<Select
									options={[
										{ label: 'No Type', value: 'none' },
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
								Dont see your type? Create a Type
							</span>
						</CreateCategoryDialog>

						{errors.categoryId?.message && (
							<ErrorMessage>{errors.categoryId?.message}</ErrorMessage>
						)}
					</div>

					<div>
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
				</div>

				<div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<Label htmlFor="startDate">Start Date *</Label>
						<div className="relative">
							<Controller
								control={control}
								name="startDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => {
											field.onChange(e);
										}}
										selected={field.value}
										startDate={field.value}
										endDate={endDateWatcher}
										selectsStart
										required
										timeIntervals={NEAREST_MINUTE}
										dateFormat="MM/dd/yyyy h:mm a"
										formatTime="MM/dd/yyyy h:mm a"
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

					<div>
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
										endDate={field.value}
										timeIntervals={NEAREST_MINUTE}
										dateFormat="MM/dd/yyyy h:mm a"
										formatTime="MM/dd/yyyy h:mm a"
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
				</div>
			</div>

			<div className="mb-5 grid grid-cols-1 gap-5">
				<div>
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
					disabled={editSessionMutation.isLoading}
				>
					{editSessionMutation.isLoading ? <LoadingInner /> : 'Edit Session'}
				</Button>
			</div>
		</form>
	);
};
