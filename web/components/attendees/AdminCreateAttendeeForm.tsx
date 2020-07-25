import { zodResolver } from '@hookform/resolvers/zod';
import * as Prisma from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { AdminCreateAttendeePayload, AdminCreateAttendeeSchema } from '@eventalapp/shared/utils';

import { useAdminCreateAttendee } from '../../hooks/mutations/useAdminCreateAttendee';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';
import Select from '../primitives/Select';
import CreateRoleDialog from '../roles/CreateRoleDialog';

type Props = {
	eid: string;
	roles: Prisma.EventRole[];
	onCancel?: () => void;
	onSuccess?: () => void;
	redirect?: boolean;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const AdminCreateAttendeeForm: React.FC<Props> = (props) => {
	const {
		eid,
		roles,
		onCancel = () => {
			router.back();
		},
		onSuccess,
		redirect = true
	} = props;
	const router = useRouter();
	const [files, setFiles] = React.useState<FileWithPreview[]>([]);
	const { adminCreateAttendeeMutation } = useAdminCreateAttendee(String(eid), {
		redirect
	});
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors }
	} = useForm<AdminCreateAttendeePayload>({
		defaultValues: {
			eventRoleId: roles?.[0]?.id
		},
		resolver: zodResolver(AdminCreateAttendeeSchema)
	});

	useEffect(() => {
		setValue('image', files[0]);
	}, [files]);

	useEffect(() => {
		if (adminCreateAttendeeMutation.isSuccess) {
			onSuccess?.();
		}
	}, [adminCreateAttendeeMutation.isSuccess]);

	return (
		<form className="space-y-5">
			<div className="my-5 grid grid-flow-row-dense grid-cols-4 gap-5">
				<div className="col-span-2 row-span-2 md:col-span-1">
					<Label htmlFor="image">Image</Label>

					<AvatarUpload
						files={files}
						setFiles={setFiles}
						placeholderImageUrl={`https://cdn.evental.app/images/default-avatar.jpg`}
					/>

					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="John Doe" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="name">Email</Label>
					<Input placeholder="john@email.com" {...register('email')} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="eventRoleId">Role *</Label>

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

					{errors.eventRoleId?.message && (
						<ErrorMessage>{errors.eventRoleId?.message}</ErrorMessage>
					)}

					<CreateRoleDialog eid={String(eid)}>
						<span className="mt-1 cursor-pointer text-sm text-gray-600">
							Dont see your role? Create a role
						</span>
					</CreateRoleDialog>
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="location">Location</Label>
					<Input placeholder="California" {...register('location')} />
					{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="position">Position</Label>
					<Input placeholder="Doctor" {...register('position')} />
					{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
				</div>

				<div className="col-span-2 md:col-span-1">
					<Label htmlFor="company">Company</Label>
					<Input placeholder="Google" {...register('company')} />
					{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
				</div>

				<div className="col-span-4 md:col-span-2">
					<Label htmlFor="website">Website</Label>
					<Input placeholder="https://example.com" {...register('website')} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
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
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={onCancel}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={adminCreateAttendeeMutation.isLoading}
					onClick={handleSubmit((data) => {
						adminCreateAttendeeMutation.mutate(data);
					})}
				>
					{adminCreateAttendeeMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
