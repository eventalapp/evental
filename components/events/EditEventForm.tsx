import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { useEventQuery, UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseEditEventMutationData } from '../../hooks/mutations/useEditEventMutation';
import { Controller, useForm } from 'react-hook-form';
import { EditEventPayload, EditEventSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { slugify } from '../../utils/slugify';
import { ErrorMessage } from '../form/ErrorMessage';
import { DatePicker } from '../form/DatePicker';
import { useRouter } from 'next/router';
import { LoadingInner } from '../error/LoadingInner';
import ImageUpload, { FileWithPreview } from '../form/ImageUpload';
import Button from '../radix/components/shared/Button';
import { EventCategory, EventType, PrivacyLevel } from '@prisma/client';
import { capitalizeFirstLetter } from '../../utils/string';
import Select from '../radix/components/Select';
import ReactSelect from 'react-select';
import { timeZoneOptions } from '../../utils/const';
import dayjs from 'dayjs';

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
			<div className="flex flex-col w-full mt-5 items-center justify-center">
				<Label htmlFor="image" className="hidden">
					Image
				</Label>

				<ImageUpload
					files={files}
					setFiles={setFiles}
					placeholderImageUrl={`https://cdn.evental.app${event.image}`}
				/>

				{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Event name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Event location" {...register('location')} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
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

					<div>
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
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<Label htmlFor="slug">Time Zone *</Label>

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
				<div>
					<Label htmlFor="privacy">Privacy *</Label>
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
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea rows={5} placeholder="Event description" {...register('description')} />
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Slug *</Label>
						<div className="flex items-center">
							<span className="mr-1 text-sm md:text-base">evental.app/events/</span>
							<Input placeholder="event-slug" {...register('slug')} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== event?.slug && eventSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
				<div className="grid grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="category">Category</Label>
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
					<div>
						<Label htmlFor="type">Type *</Label>
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
