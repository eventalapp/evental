import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useUserById } from '@eventalapp/shared/hooks';
import {
	AdminEditAttendeePayload,
	AdminEditAttendeeSchema,
	AttendeeWithUser,
	FullUser,
	capitalizeFirstLetter,
	copy,
	slugify
} from '@eventalapp/shared/utils';

import { useEditAttendee } from '../../hooks/mutations/useEditAttendee';
import { useImageUpload } from '../../hooks/mutations/useImageUpload';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { HelpTooltip } from '../primitives/HelpTooltip';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Select from '../primitives/Select';
import Tooltip from '../primitives/Tooltip';
import CreateRoleDialog from '../roles/CreateRoleDialog';

type Props = {
	eid: string;
	uid: string;
	attendee: AttendeeWithUser;
	roles: Prisma.EventRole[];
	user: FullUser | undefined;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const AdminEditAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { attendee, roles, eid, uid, user } = props;
	const { adminEditAttendeeMutation } = useEditAttendee(String(eid), String(uid));
	const { imageUploadMutation } = useImageUpload();
	const [files, setFiles] = React.useState<FileWithPreview[]>([]);

	const {
		handleSubmit,
		control,
		setValue,
		register,
		watch,
		formState: { errors }
	} = useForm<AdminEditAttendeePayload>({
		defaultValues: {
			eventRoleId: attendee?.eventRoleId ?? undefined,
			permissionRole: attendee?.permissionRole ?? undefined,
			name: user?.name ?? undefined,
			slug: user?.slug ?? undefined,
			description: user?.description ?? undefined,
			location: user?.location ?? undefined,
			company: user?.company ?? undefined,
			position: user?.position ?? undefined,
			website: user?.website ?? undefined,
			email: user?.email ?? undefined
		},
		resolver: zodResolver(AdminEditAttendeeSchema)
	});

	const slugWatcher = watch('slug');

	const { data: userSlugCheck, isLoading: isUserSlugCheckLoading } = useUserById({
		uid: String(slugWatcher)
	});

	useEffect(() => {
		if (slugWatcher) {
			setValue('slug', slugify(slugWatcher));
		}
	}, [slugWatcher]);

	useEffect(() => {
		setValue('image', files[0]);
	}, [files]);

	return (
		<form
			onSubmit={handleSubmit((data) => {
				adminEditAttendeeMutation.mutate(data);
			})}
		>
			<div className="mt-3 mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
				<div>
					<Label htmlFor="eventRoleId">Role *</Label>
					{roles && (
						<Controller
							control={control}
							name="eventRoleId"
							render={({ field }) => (
								<Select
									options={roles.map((role) => ({ label: role.name, value: role.id }))}
									value={field.value}
									onValueChange={(value) => {
										setValue('eventRoleId', value);
									}}
								/>
							)}
						/>
					)}

					{errors.eventRoleId?.message && (
						<ErrorMessage>{errors?.eventRoleId?.message}</ErrorMessage>
					)}

					<CreateRoleDialog eid={String(eid)}>
						<span className="mt-1 cursor-pointer text-sm text-gray-600">
							Dont see your role? Create a role
						</span>
					</CreateRoleDialog>
				</div>
				<div>
					<Label htmlFor="permissionRole">Permission Role *</Label>

					{Prisma.EventPermissionRole && (
						<Controller
							control={control}
							name="permissionRole"
							render={({ field }) => (
								<Select
									options={Object.values(Prisma.EventPermissionRole).map((role) => ({
										label: capitalizeFirstLetter(role.toLowerCase()),
										value: role
									}))}
									value={field.value}
									onValueChange={(value) => {
										setValue('permissionRole', value);
									}}
								/>
							)}
						/>
					)}

					{errors?.permissionRole?.message && (
						<ErrorMessage>{errors?.permissionRole?.message}</ErrorMessage>
					)}
				</div>
			</div>

			{user && (
				<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
					<div className="col-span-2 row-span-2 md:col-span-1">
						<Label htmlFor="image">Image</Label>

						<Tooltip message={'Upload an image for your profile.'}>
							<div className="inline-block">
								<AvatarUpload
									files={files}
									setFiles={setFiles}
									placeholderImageUrl={`https://cdn.evental.app${user.image}`}
								/>
							</div>
						</Tooltip>

						{errors?.image?.message && <ErrorMessage>{errors?.image?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4 md:col-span-3">
						<Label htmlFor="slug">
							Username *<HelpTooltip message={copy.tooltip.userSlug} />
						</Label>
						<div className="flex items-center">
							<span className="mr-1 text-base text-gray-700">evental.app/users/</span>
							<Input placeholder="user-slug" {...register('slug')} />
						</div>
						{errors?.slug?.message && <ErrorMessage>{errors?.slug?.message}</ErrorMessage>}
						{slugWatcher !== user?.slug && userSlugCheck && (
							<ErrorMessage>This username is already taken, please choose another</ErrorMessage>
						)}
					</div>

					<div className="col-span-4 md:col-span-3">
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="User name" {...register('name')} />
						{errors?.name?.message && <ErrorMessage>{errors?.name?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4 md:col-span-2">
						<Label htmlFor="location">Location</Label>
						<Input placeholder="User location" {...register('location')} />
						{errors?.location?.message && <ErrorMessage>{errors?.location?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4 md:col-span-2">
						<Label htmlFor="position">
							Position
							<HelpTooltip message={copy.tooltip.userPosition} />
						</Label>
						<Input placeholder="Position" {...register('position')} />
						{errors?.position?.message && <ErrorMessage>{errors?.position?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4 md:col-span-2">
						<Label htmlFor="company">
							Company
							<HelpTooltip message={copy.tooltip.userCompany} />
						</Label>
						<Input placeholder="Company" {...register('company')} />
						{errors?.company?.message && <ErrorMessage>{errors?.company?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4 md:col-span-2">
						<Label htmlFor="website">
							Website
							<HelpTooltip message={copy.tooltip.userWebsite} />
						</Label>
						<Input placeholder="Website" {...register('website')} />
						{errors?.website?.message && <ErrorMessage>{errors?.website?.message}</ErrorMessage>}
					</div>

					<div className="col-span-4">
						<Label>Email</Label>
						<Input placeholder="email@gmail.com" {...register('email')} />
					</div>

					<div className="col-span-4">
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
						{errors?.description?.message && (
							<ErrorMessage>{errors?.description?.message}</ErrorMessage>
						)}
					</div>
				</div>
			)}

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					className="ml-4"
					disabled={
						adminEditAttendeeMutation.isLoading ||
						imageUploadMutation.isLoading ||
						isUserSlugCheckLoading ||
						Boolean(slugWatcher !== user?.slug && userSlugCheck)
					}
				>
					{adminEditAttendeeMutation.isLoading ? <LoadingInner /> : 'Save'}
				</Button>
			</div>
		</form>
	);
};
