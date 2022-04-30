import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
	CreateAttendeePayload,
	CreateAttendeeSchema,
	ImageUploadSchema
} from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { useAttendeeQuery } from '../../hooks/queries/useAttendeeQuery';
import { slugify } from '../../utils/slugify';
import { UseCreateAttendeeMutationData } from '../../hooks/mutations/useCreateAttendeeMutation';
import Image from 'next/image';
import { UseImageUploadMutationData } from '../../hooks/mutations/useImageUploadMutation';
import { useRouter } from 'next/router';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseCreateAttendeeMutationData &
	UseImageUploadMutationData;

export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createAttendeeMutation, event, imageUploadMutation, imageUploadResponse } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<CreateAttendeePayload>({
		defaultValues: {
			image: '/images/default-event.jpg'
		},
		resolver: zodResolver(CreateAttendeeSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const imageWatcher = watch('image');

	const { attendee, isAttendeeLoading } = useAttendeeQuery(String(event?.id), slugWatcher);

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

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createAttendeeMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Full Name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Location" {...register('location', { required: true })} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="position">Position</Label>
						<Input placeholder="Position" {...register('position', { required: true })} />
						{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="company">Company</Label>
						<Input placeholder="Company" {...register('company', { required: true })} />
						{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
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
							<span className="mr-1 text-md">/attendees/</span>
							<Input placeholder="attendee-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{attendee && (
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
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={imageUploadMutation.isLoading || isAttendeeLoading || Boolean(attendee)}
				>
					Register
				</Button>
			</div>
		</form>
	);
};
