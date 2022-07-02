import { zodResolver } from '@hookform/resolvers/zod';
import { roundToNearestMinutes } from 'date-fns';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { NEAREST_MINUTE } from '../../config';
import { UseCreateSessionMutationData } from '../../hooks/mutations/useCreateSessionMutation';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseSessionCategoriesQueryData } from '../../hooks/queries/useSessionCategoriesQuery';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { FIFTEEN_MINUTES, copy } from '../../utils/const';
import { CreateSessionPayload, CreateSessionSchema } from '../../utils/schemas';
import { HelpTooltip } from '../HelpTooltip';
import { TimeZoneNotice } from '../TimeZoneNotice';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { DatePicker } from '../form/DatePicker';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import CreateCategoryDialog from '../radix/components/CreateCategoryDialog';
import CreateVenueDialog from '../radix/components/CreateVenueDialog';
import Select from '../radix/components/Select';

type Props = {
	eid: string;
};

type CreateSessionFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenuesQueryData &
	UseCreateSessionMutationData &
	UseEventQueryData &
	UseSessionCategoriesQueryData;

export const CreateSessionForm: React.FC<CreateSessionFormProps> = (props) => {
	const router = useRouter();
	const { eid, venues, createSessionMutation, event, sessionCategories } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors }
	} = useForm<CreateSessionPayload>({
		defaultValues: {
			venueId: 'none',
			categoryId: 'none',
			startDate: roundToNearestMinutes(
				new Date(event?.startDate ?? '').getTime() + 1000 * 60 * 60 * 12,
				{
					nearestTo: NEAREST_MINUTE
				}
			),
			endDate: roundToNearestMinutes(
				new Date(new Date(event?.startDate ?? '').getTime() + 1000 * 60 * 60 * 16),
				{
					nearestTo: NEAREST_MINUTE
				}
			)
		},
		resolver: zodResolver(CreateSessionSchema)
	});

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

	if (!venues || !event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createSessionMutation.mutate(data);
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
				</div>

				<div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
					<div>
						<Label htmlFor="categoryId">
							Type
							<HelpTooltip message={copy.tooltip.type} />
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
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										startDate={field.value}
										required
										endDate={endDateWatcher}
										selectsStart
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
										timeIntervals={NEAREST_MINUTE}
										endDate={field.value}
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
					disabled={createSessionMutation.isLoading}
				>
					{createSessionMutation.isLoading ? <LoadingInner /> : 'Create Session'}
				</Button>
			</div>
		</form>
	);
};
