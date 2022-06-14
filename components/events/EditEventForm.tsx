import { zodResolver } from '@hookform/resolvers/zod';
import { EventCategory, EventType, PrivacyLevel } from '@prisma/client';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { toast } from 'react-toastify';

import { UseEditEventMutationData } from '../../hooks/mutations/useEditEventMutation';
import { useEventQuery, UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { copy, timeZoneOptions } from '../../utils/const';
import { EditEventPayload, EditEventSchema } from '../../utils/schemas';
import { slugify } from '../../utils/slugify';
import { capitalizeFirstLetter } from '../../utils/string';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { DatePicker } from '../form/DatePicker';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { HelpTooltip } from '../HelpTooltip';
import Select from '../radix/components/Select';
import Button from '../radix/components/shared/Button';

type Props = {
	eid: string;
	canCancel?: boolean;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseEditEventMutationData;

export const EditEventForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { editEventMutation, event, canCancel = false } = props;
	const [files, setFiles] = React.useState<FileWithPreview[]>([]);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors }
	} = useForm<EditEventPayload>({
		defaultValues: {
			name: event?.name ?? undefined,
			description: event?.description ?? undefined,
			image: event?.image,
			location: event?.location ?? undefined,
			type: event?.type ?? undefined,
			category: event?.category ?? undefined,
			website: event?.website ?? undefined,
			color: event?.color ?? undefined,
			privacy: event?.privacy ?? undefined,
			timeZone: event?.timeZone ?? 'America/New_York',
			slug: event?.slug ?? undefined,
			endDate: dayjs(event?.endDate).toDate() ?? undefined,
			startDate: dayjs(event?.startDate).toDate() ?? undefined
		},
		resolver: zodResolver(EditEventSchema)
	});

	const slugWatcher = watch('slug');
	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	const { event: eventSlugCheck, isEventLoading: isEventSlugCheckLoading } =
		useEventQuery(slugWatcher);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('endDate', startDateWatcher);
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('startDate', endDateWatcher);
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	useEffect(() => {
		setValue('image', files[0]);
	}, [files]);

	if (!event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editEventMutation.mutate(data);
			})}
		>
			<div className="grid grid-cols-4 gap-5 grid-flow-row-dense my-5">
				<div className="col-span-2 md:col-span-1 row-span-2">
					<Label htmlFor="image">Image</Label>

					<AvatarUpload
						rounded={false}
						files={files}
						setFiles={setFiles}
						placeholderImageUrl={`https://cdn.evental.app${event.image}`}
					/>

					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Event name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="category">
						Category
						<HelpTooltip message={copy.tooltip.eventCategory} />
					</Label>
					{EventCategory && (
						<div>
							<Controller
								control={control}
								name="category"
								render={({ field }) => (
									<Select
										options={Object.values(EventCategory).map((category) => ({
											label: capitalizeFirstLetter(category.toLowerCase().replace('_', ' ')),
											value: category
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue('category', EventCategory[value as keyof typeof EventCategory]);
										}}
									/>
								)}
							/>
						</div>
					)}
					{errors.type?.message && <ErrorMessage>{errors.type?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="location">Location</Label>
					<Input placeholder="Event location" {...register('location')} />
					{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="type">
						Type *<HelpTooltip message={copy.tooltip.eventType} />
					</Label>
					{EventType && (
						<div>
							<Controller
								control={control}
								name="type"
								render={({ field }) => (
									<Select
										options={Object.values(EventType).map((type) => ({
											label: capitalizeFirstLetter(type.toLowerCase().replace('_', ' ')),
											value: type
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue('type', EventType[value as keyof typeof EventType]);
										}}
									/>
								)}
							/>
						</div>
					)}
					{errors.type?.message && <ErrorMessage>{errors.type?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="website">
						Website *<HelpTooltip message={copy.tooltip.eventWebsite} />
					</Label>
					<Input placeholder="https://website.com" {...register('website')} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="slug">
						Time Zone *<HelpTooltip message={copy.tooltip.eventTimeZone} />
					</Label>

					<Controller
						control={control}
						name="timeZone"
						render={({ field }) => (
							<ReactSelect
								options={timeZoneOptions}
								className="w-full block"
								value={timeZoneOptions.find((val) => val.value === field.value)}
								onChange={(val) => {
									field.onChange(val?.value);
								}}
							/>
						)}
					/>

					{errors.timeZone?.message && <ErrorMessage>{errors.timeZone?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="startDate">Start Date *</Label>
					<div className="relative">
						<Controller
							control={control}
							name="startDate"
							render={({ field }) => (
								<DatePicker
									onChange={(date) => {
										field.onChange(dayjs(date).toDate());
									}}
									selected={dayjs(field.value).toDate()}
									startDate={dayjs(field.value).toDate()}
									endDate={endDateWatcher}
									selectsStart
									required
									dateFormat="MM/dd/yyyy"
								/>
							)}
						/>
					</div>
					{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="endDate">End Date *</Label>
					<div className="relative">
						<Controller
							control={control}
							name="endDate"
							render={({ field }) => (
								<DatePicker
									onChange={(date) => {
										field.onChange(dayjs(date).toDate());
									}}
									selected={dayjs(field.value).toDate()}
									selectsEnd
									required
									startDate={startDateWatcher}
									endDate={dayjs(field.value).toDate()}
									dateFormat="MM/dd/yyyy"
								/>
							)}
						/>
					</div>
					{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="maxAttendees">
						Max Attendees *
						<HelpTooltip
							message={`Your events max attendee count is ${event.maxAttendees}. To increase this, please contact us.`}
						/>
					</Label>
					<Input onChange={() => {}} value={`${event.maxAttendees}`} type="number" />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
					{event.level === 'TRIAL' ? (
						<p className="text-gray-600 text-sm mt-1">
							Want to increase your max attendee count?{' '}
							<Link href={`/events/${event.slug}/admin/billing`}>
								<a className="text-primary font-medium">Upgrade your plan</a>
							</Link>
						</p>
					) : (
						<p className="text-gray-600 text-sm mt-1">
							Want to increase your max attendee count?{' '}
							<Link href={`/contact`}>
								<a className="text-primary font-medium">Contact Us</a>
							</Link>
						</p>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="privacy">
						Privacy *<HelpTooltip message={copy.tooltip.eventPrivacy} />
					</Label>
					{PrivacyLevel && (
						<div>
							<Controller
								control={control}
								name="privacy"
								render={({ field }) => (
									<Select
										options={Object.values(PrivacyLevel).map((type) => ({
											label: capitalizeFirstLetter(type.toLowerCase()),
											value: type
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue('privacy', PrivacyLevel[value as keyof typeof PrivacyLevel]);
										}}
									/>
								)}
							/>
						</div>
					)}
					{errors.privacy?.message && <ErrorMessage>{errors.privacy?.message}</ErrorMessage>}
					{event.level === 'TRIAL' && (
						<p className="text-gray-600 text-sm mt-1">
							Want to make your event public?{' '}
							<Link href={`/events/${event.slug}/admin/billing`}>
								<a className="text-primary font-medium">Upgrade your plan</a>
							</Link>
						</p>
					)}
				</div>

				<div className="col-span-4">
					<Label htmlFor="description">Description</Label>
					<Textarea rows={5} placeholder="Event description" {...register('description')} />
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="slug">
						Slug *<HelpTooltip message={copy.tooltip.eventSlug} />
					</Label>
					<div className="flex items-center">
						<span className="mr-1 text-sm md:text-base">evental.app/events/</span>
						<Input placeholder="event-slug" {...register('slug')} />
					</div>
					{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
					{slugWatcher !== event?.slug && eventSlugCheck && (
						<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="slug">
						Color *<HelpTooltip message={copy.tooltip.color} />
					</Label>
					<Controller
						control={control}
						name="color"
						render={({ field }) => (
							<ChromePicker
								disableAlpha
								color={field.value}
								onChange={(val) => {
									field.onChange(val.hex);
								}}
							/>
						)}
					/>
					{errors.color?.message && <ErrorMessage>{errors.color?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				{canCancel && (
					<Button type="button" onClick={router.back}>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					className={`ml-4`}
					variant="primary"
					disabled={
						editEventMutation.isLoading ||
						isEventSlugCheckLoading ||
						Boolean(slugWatcher !== event?.slug && eventSlugCheck)
					}
				>
					{editEventMutation.isLoading ? <LoadingInner /> : 'Edit Event'}
				</Button>
			</div>
		</form>
	);
};
