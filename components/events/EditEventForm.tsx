import React, { ChangeEvent, DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { useEventQuery, UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { UseEditEventMutationData } from '../../hooks/mutations/useEditEventMutation';
import { Controller, useForm } from 'react-hook-form';
import { EditEventPayload, EditEventSchema, ImageUploadSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { slugify } from '../../utils/slugify';
import { ErrorMessage } from '../form/ErrorMessage';
import { DatePicker } from '../form/DatePicker';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { UseImageUploadMutationData } from '../../hooks/mutations/useImageUploadMutation';

type Props = {
	eid: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseEditEventMutationData &
	UseImageUploadMutationData;

export const EditEventForm: React.FC<Props> = (props) => {
	const { editEventMutation, event, imageUploadMutation, imageUploadResponse } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		control,
		formState: { errors }
	} = useForm<EditEventPayload>({
		defaultValues: {
			name: event?.name ?? undefined,
			description: event?.description ?? undefined,
			image: event?.image ?? '/images/default-event.jpg',
			location: event?.location ?? undefined,
			slug: event?.slug ?? undefined,
			endDate: new Date(String(event?.endDate)) ?? undefined,
			startDate: new Date(String(event?.startDate)) ?? undefined
		},
		resolver: zodResolver(EditEventSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const imageWatcher = watch('image');
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
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	useEffect(() => {
		if (imageUploadResponse) {
			setValue('image', imageUploadResponse.pathName);
		}
	}, [imageUploadResponse]);

	if (!event) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editEventMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Event name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Event location" {...register('location', { required: true })} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="startDate">Start Date</Label>
						<div className="relative">
							<Controller
								control={control}
								name="startDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										startDate={field.value}
										endDate={endDateWatcher}
										selectsStart
										dateFormat="MM/dd/yyyy"
									/>
								)}
							/>
						</div>
						{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="endDate">End Date</Label>
						<div className="relative">
							<Controller
								control={control}
								name="endDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										selectsEnd
										startDate={startDateWatcher}
										endDate={field.value}
										dateFormat="MM/dd/yyyy"
									/>
								)}
							/>
						</div>
						{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						rows={5}
						placeholder="Event description"
						{...register('description', { required: true })}
					/>
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Slug</Label>
						<div className="flex items-center">
							<span className="mr-1 text-md">evental.app/events/</span>
							<Input placeholder="event-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== event?.slug && eventSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>

				<div>
					<p>Current image:</p>

					<div className="h-16 w-16 relative">
						<Image
							alt={'Event image'}
							src={String(
								imageWatcher
									? `https://cdn.evental.app${imageWatcher}`
									: `https://cdn.evental.app/images/default-avatar.jpg`
							)}
							className="rounded-md"
							layout="fill"
						/>
					</div>

					<Label htmlFor="image">Image</Label>
					<Input
						type="file"
						accept="image/png, image/jpeg"
						onChange={(e: ChangeEvent<HTMLInputElement>) => {
							const files = e?.target?.files;

							const filesParsed = ImageUploadSchema.parse({ image: files });

							imageUploadMutation.mutate(filesParsed);
						}}
					/>
					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					disabled={
						imageUploadMutation.isLoading ||
						isEventSlugCheckLoading ||
						Boolean(slugWatcher !== event?.slug && eventSlugCheck)
					}
				>
					Edit Event
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
				</Button>
			</div>
		</form>
	);
};
