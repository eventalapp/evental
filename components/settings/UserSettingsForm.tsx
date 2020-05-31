import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { UseEditUserMutationData } from '../../hooks/mutations/useEditUserMutation';
import { UseUserData } from '../../hooks/queries/useUser';
import { useUserQuery } from '../../hooks/queries/useUserQuery';
import { copy } from '../../utils/const';
import { EditUserPayload, EditUserSchema } from '../../utils/schemas';
import { slugify } from '../../utils/slugify';
import { HelpTooltip } from '../HelpTooltip';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { Button } from '../form/Button';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';

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
		control,
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

				<AvatarUpload
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
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="position">
							Position
							<HelpTooltip message={copy.tooltip.userPosition} />
						</Label>
						<Input placeholder="Position" {...register('position')} />
						{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="company">
							Company
							<HelpTooltip message={copy.tooltip.userCompany} />
						</Label>
						<Input placeholder="Company" {...register('company')} />
						{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Controller
						control={control}
						name="description"
						render={({ field }) => (
							<StyledEditor
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
			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">
							Username *<HelpTooltip message={copy.tooltip.userSlug} />
						</Label>
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
					<Label htmlFor="website">
						Website
						<HelpTooltip message={copy.tooltip.userWebsite} />
					</Label>
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
