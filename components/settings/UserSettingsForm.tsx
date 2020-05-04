import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { slugify } from '../../utils/slugify';
import { EditUserPayload, EditUserSchema } from '../../utils/schemas';
import { Textarea } from '../form/Textarea';
import { UseUserData } from '../../hooks/queries/useUser';
import { ErrorMessage } from '../form/ErrorMessage';
import { UseEditUserMutationData } from '../../hooks/mutations/useEditUserMutation';
import { Label } from '../form/Label';
import { Input } from '../form/Input';
import { Button } from '../form/Button';
import { useUserQuery } from '../../hooks/queries/useUserQuery';
import ImageUpload, { FileWithPreview } from '../form/ImageUpload';
import { LoadingInner } from '../error/LoadingInner';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEditUserMutationData &
	UseUserData;

export const UserSettingsForm: React.FC<Props> = (props) => {
	const { user, editUserMutation } = props;
	const [files, setFiles] = React.useState<FileWithPreview[]>([]);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors }
	} = useForm<EditUserPayload>({
		defaultValues: {
			name: user?.name ?? undefined,
			slug: user?.slug ?? undefined,
			description: user?.description ?? undefined,
			location: user?.location ?? undefined,
			company: user?.company ?? undefined,
			position: user?.position ?? undefined,
			website: user?.website ?? undefined
		},
		resolver: zodResolver(EditUserSchema)
	});

	const slugWatcher = watch('slug');

	const { user: userSlugCheck, isUserLoading: isUserSlugCheckLoading } = useUserQuery(slugWatcher);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	useEffect(() => {
		setValue('image', files[0]);
	}, [files]);

	if (!user) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editUserMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5 items-center justify-center">
				<Label htmlFor="image" className="hidden">
					Image
				</Label>

				<ImageUpload
					files={files}
					setFiles={setFiles}
					placeholderImageUrl={`https://cdn.evental.app${user.image}`}
				/>

				{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="User name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="User location" {...register('location')} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
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
							<Input placeholder="user-slug" {...register('slug')} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{slugWatcher !== user?.slug && userSlugCheck && (
							<ErrorMessage>This username is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
				<div>
					<Label htmlFor="website">Website</Label>
					<Input placeholder="Website" {...register('website')} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
				</div>
			</div>
			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={
						editUserMutation.isLoading ||
						isUserSlugCheckLoading ||
						Boolean(slugWatcher !== user?.slug && userSlugCheck)
					}
				>
					{editUserMutation.isLoading ? <LoadingInner /> : 'Edit User'}
				</Button>
			</div>
		</form>
	);
};
