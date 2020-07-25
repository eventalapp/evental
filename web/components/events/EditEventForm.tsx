import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import Color from 'color';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import ReactDatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import ReactSelect from 'react-select';

import { useEvent } from '@eventalapp/shared/hooks';
import {
	EditEventPayload,
	EditEventSchema,
	capitalizeFirstLetter,
	copy,
	formatDateRange,
	slugify,
	timeZoneOptions
} from '@eventalapp/shared/utils';

import { UseEditEventMutationData } from '../../hooks/mutations/useEditEvent';
import { theme } from '../../tailwind.config';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { renderCustomHeader } from '../form/DatePicker';
import { DatePickerButton } from '../form/DatePickerButton';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Select from '../primitives/Select';
import { Textarea } from '../primitives/Textarea';
import Tooltip from '../primitives/Tooltip';

type Props = {
	eid: string;
	canCancel?: boolean;
	event: Prisma.Event;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
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
			privacy: event?.privacy ?? Prisma.PrivacyLevel.PRIVATE,
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
	const colorWatcher = watch('color');

	const { data: eventSlugCheck, isLoading: isEventSlugCheckLoading } = useEvent({
		eid: slugWatcher
	});

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
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-2 row-span-2 md:col-span-1">
					<Label htmlFor="image">Image</Label>

					<Tooltip
						message={'Upload an image for your event. You can use an event logo or icon here.'}
					>
						<div className="inline-block">
							<AvatarUpload
								files={files}
								setFiles={setFiles}
								placeholderImageUrl={`https://cdn.evental.app${event.image}`}
							/>
						</div>
					</Tooltip>

					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Event name" {...register('name')} color={colorWatcher} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="category">
						Category
						<HelpTooltip message={copy.tooltip.eventCategory} />
					</Label>
					{Prisma.EventCategory && (
						<div>
							<Controller
								control={control}
								name="category"
								render={({ field }) => (
									<Select
										color={colorWatcher}
										options={Object.values(Prisma.EventCategory).map((category) => ({
											label: capitalizeFirstLetter(category.toLowerCase().replace('_', ' ')),
											value: category
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue(
												'category',
												Prisma.EventCategory[value as keyof typeof Prisma.EventCategory]
											);
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
					<Input placeholder="Event location" {...register('location')} color={colorWatcher} />
					{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="type">
						Type *<HelpTooltip message={copy.tooltip.eventType} />
					</Label>
					{Prisma.EventType && (
						<div>
							<Controller
								control={control}
								name="type"
								render={({ field }) => (
									<Select
										color={colorWatcher}
										options={Object.values(Prisma.EventType).map((type) => ({
											label: capitalizeFirstLetter(type.toLowerCase().replace('_', ' ')),
											value: type
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue('type', Prisma.EventType[value as keyof typeof Prisma.EventType]);
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
						Website
						<HelpTooltip message={copy.tooltip.eventWebsite} />
					</Label>
					<Input placeholder="https://website.com" {...register('website')} color={colorWatcher} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="slug">
						Time Zone *<HelpTooltip message={copy.tooltip.eventTimeZone} />
					</Label>

					<Controller
						control={control}
						name="timeZone"
						render={({ field }) => {
							return (
								<ReactSelect
									theme={{
										colors: {
											primary: colorWatcher ?? theme.extend.colors.primary.DEFAULT,
											primary25:
												Color(colorWatcher).lighten(0.75).hex() ?? theme.extend.colors.primary[200],
											primary50:
												Color(colorWatcher).lighten(0.5).hex() ?? theme.extend.colors.primary[300],
											primary75:
												Color(colorWatcher).lighten(0.25).hex() ?? theme.extend.colors.primary[900],
											danger: theme.extend.colors.red.DEFAULT,
											dangerLight: theme.extend.colors.red[300],
											neutral0: '#FFFFFF',
											neutral5: theme.extend.colors.gray[50],
											neutral10: theme.extend.colors.gray[100],
											neutral20: theme.extend.colors.gray[200],
											neutral30: theme.extend.colors.gray[300],
											neutral40: theme.extend.colors.gray[400],
											neutral50: theme.extend.colors.gray[500],
											neutral60: theme.extend.colors.gray[600],
											neutral70: theme.extend.colors.gray[700],
											neutral80: theme.extend.colors.gray[800],
											neutral90: theme.extend.colors.gray[900]
										},
										borderRadius: 4,
										spacing: {
											baseUnit: 4,
											controlHeight: 36,
											menuGutter: 0
										}
									}}
									options={timeZoneOptions}
									className="block w-full"
									value={timeZoneOptions.find((val) => val.value === field.value)}
									onChange={(val) => {
										field.onChange(val?.value);
									}}
								/>
							);
						}}
					/>

					{errors.timeZone?.message && <ErrorMessage>{errors.timeZone?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label>Date *</Label>
					<div className="relative">
						<ReactDatePicker
							selected={startDateWatcher}
							onChange={(dates: any) => {
								const [start, end] = dates;

								setValue('startDate', start);

								setValue('endDate', end);
							}}
							startDate={startDateWatcher}
							endDate={endDateWatcher}
							selectsRange
							minDate={new Date()}
							required
							popperPlacement="bottom"
							placeholderText="Select date"
							nextMonthButtonLabel=">"
							previousMonthButtonLabel="<"
							popperClassName="react-datepicker-right"
							customInput={
								<DatePickerButton>
									{startDateWatcher && endDateWatcher
										? formatDateRange(startDateWatcher, endDateWatcher, { showHour: false })
										: 'Select date'}
								</DatePickerButton>
							}
							renderCustomHeader={renderCustomHeader}
						/>
					</div>
					{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
					{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="slug">
						Slug *<HelpTooltip message={copy.tooltip.eventSlug} />
					</Label>
					<div className="flex items-center">
						<span className="mr-1 text-sm md:text-base">evental.app/events/</span>
						<Input placeholder="event-slug" {...register('slug')} color={colorWatcher} />
					</div>
					{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
					{slugWatcher !== event?.slug && eventSlugCheck && (
						<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="privacy">
						Privacy *<HelpTooltip message={copy.tooltip.eventPrivacy} />
					</Label>
					{Prisma.PrivacyLevel && (
						<div>
							<Controller
								control={control}
								name="privacy"
								render={({ field }) => (
									<Select
										options={Object.values(Prisma.PrivacyLevel).map((type) => ({
											label: capitalizeFirstLetter(type.toLowerCase()),
											value: type
										}))}
										value={field.value}
										onValueChange={(value) => {
											setValue(
												'privacy',
												Prisma.PrivacyLevel[value as keyof typeof Prisma.PrivacyLevel]
											);
										}}
										color={colorWatcher}
									/>
								)}
							/>
						</div>
					)}
					{errors.privacy?.message && <ErrorMessage>{errors.privacy?.message}</ErrorMessage>}
					{event.level === 'TRIAL' && (
						<p className="mt-1 text-sm text-gray-600">
							Want to make your event public?{' '}
							<Link href={`/events/${event.slug}/admin/billing`}>
								<a
									className="font-medium"
									style={{
										color: colorWatcher ?? theme.extend.colors.primary.DEFAULT
									}}
								>
									Upgrade your plan
								</a>
							</Link>
						</p>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="maxAttendees">
						Max Attendees *
						<HelpTooltip
							message={`Your events max attendee count is ${event.maxAttendees}. To increase this, please contact us.`}
						/>
					</Label>
					<Input
						onChange={() => {}}
						value={`${event.maxAttendees}`}
						type="number"
						color={colorWatcher}
						disabled
					/>
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
					{event.level === 'TRIAL' ? (
						<p className="mt-1 text-sm text-gray-600">
							Want to increase your max attendee count?{' '}
							<Link href={`/events/${event.slug}/admin/billing`}>
								<a
									className="font-medium"
									style={{
										color: colorWatcher ?? theme.extend.colors.primary.DEFAULT
									}}
								>
									Upgrade your plan
								</a>
							</Link>
						</p>
					) : (
						<p className="mt-1 text-sm text-gray-600">
							Want to increase your max attendee count?{' '}
							<Link href={`/contact`}>
								<a
									className="font-medium"
									style={{
										color: colorWatcher ?? theme.extend.colors.primary.DEFAULT
									}}
								>
									Contact Us
								</a>
							</Link>
						</p>
					)}
				</div>

				<div className="col-span-4">
					<Label htmlFor="description">Description</Label>
					<Textarea
						rows={5}
						placeholder="Event description"
						{...register('description')}
						color={colorWatcher}
					/>
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="color">
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
					className="ml-4"
					variant="primary"
					style={{
						backgroundColor: colorWatcher ?? theme.extend.colors.primary.DEFAULT,
						color: Color(colorWatcher).isLight() ? '#000' : '#FFF'
					}}
					disabled={
						editEventMutation.isLoading ||
						isEventSlugCheckLoading ||
						Boolean(slugWatcher !== event?.slug && eventSlugCheck)
					}
				>
					{editEventMutation.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
