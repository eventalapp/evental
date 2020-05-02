import React, { ChangeEvent, DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { slugify } from '../utils/slugify';
import { EditUserPayload, EditUserSchema, ImageUploadSchema } from '../utils/schemas';
import { Textarea } from './form/Textarea';
import { UseUserData } from '../hooks/queries/useUser';
import { ErrorMessage } from './form/ErrorMessage';
import { UseEditUserMutationData } from '../hooks/mutations/useEditUserMutation';
import { UseImageUploadMutationData } from '../hooks/mutations/useImageUploadMutation';
import { Label } from './form/Label';
import { Input } from './form/Input';
import { Button } from './form/Button';
import { useUserQuery } from '../hooks/queries/useUserQuery';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEditUserMutationData &
	UseImageUploadMutationData &
	UseUserData;

export const UserSettingsForm: React.FC<Props> = (props) => {
	const { imageUploadMutation, user, editUserMutation, imageUploadResponse } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<EditUserPayload>({
		defaultValues: {
			name: user?.name ?? undefined,
			image: user?.image ?? undefined,
			slug: user?.slug ?? undefined,
			description: user?.description ?? undefined,
			location: user?.location ?? undefined,
			company: user?.company ?? undefined,
			position: user?.position ?? undefined,
			website: user?.website ?? undefined
		},
		resolver: zodResolver(EditUserSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const imageWatcher = watch('image');

	const { user: userSlugCheck, isUserLoading: isUserSlugCheckLoading } = useUserQuery(slugWatcher);

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

	if (!user) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editUserMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="User name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="User location" {...register('location')} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>{' '}
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="position">Position</Label>
						<Input placeholder="Position" {...register('position')} />
						{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="company">Company</Label>
						<Input placeholder="Company" {...register('company')} />
						{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea rows={5} placeholder="User description" {...register('description')} />
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Username *</Label>
						<div className="flex items-center">
							<span className="mr-1 text-md">evental.app/users/</span>
							<Input placeholder="user-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== user?.slug && userSlugCheck && (
							<ErrorMessage>This username is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>

				<div>
					<p>Current image:</p>

					<div className="h-16 w-16 relative">
						<Image
							alt={'User image'}
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
					className="ml-4"
					padding="medium"
					disabled={
						imageUploadMutation.isLoading ||
						isUserSlugCheckLoading ||
						Boolean(slugWatcher !== user?.slug && userSlugCheck)
					}
				>
					Edit User
				</Button>
			</div>
		</form>
	);
};
