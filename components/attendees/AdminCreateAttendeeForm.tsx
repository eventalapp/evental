import { zodResolver } from '@hookform/resolvers/zod';
import Prisma from '@prisma/client';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { UseAdminCreateAttendeeMutationData } from '../../hooks/mutations/useAdminCreateAttendeeMutation';
import { AdminCreateAttendeePayload, AdminCreateAttendeeSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import AvatarUpload, { FileWithPreview } from '../form/AvatarUpload';
import { Button } from '../form/Button';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import CreateRoleDialog from '../radix/components/CreateRoleDialog';
import Select from '../radix/components/Select';

type Props = { eid: string; roles: Prisma.EventRole[] | undefined } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseAdminCreateAttendeeMutationData;

export const AdminCreateAttendeeForm: React.FC<Props> = (props) => {
	const { eid, adminCreateAttendeeMutation, roles } = props;
	const [files, setFiles] = React.useState<FileWithPreview[]>([]);

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

	return (
		<form
			className="space-y-5"
			onSubmit={handleSubmit((data) => {
				adminCreateAttendeeMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full items-center justify-center">
				<Label htmlFor="image" className="hidden">
					Image
				</Label>

				<AvatarUpload
					files={files}
					setFiles={setFiles}
					placeholderImageUrl={`https://cdn.evental.app/images/default-avatar.jpg`}
				/>

				{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
			</div>
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Location" {...register('location')} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full">
				<div className="grid grid-cols-1 md:grid-cols-2gap-5">
					<div>
						<Label htmlFor="name">Email *</Label>
						<Input placeholder="john@email.com" {...register('email')} />
						{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
			<div className="grid grid-cols-1 gap-5">
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				<div>
					<Label htmlFor="website">Website</Label>
					<Input placeholder="Website" {...register('website')} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
				</div>

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
						<ErrorMessage>{errors.eventRoleId?.message}</ErrorMessage>
					)}

					<CreateRoleDialog eid={String(eid)}>
						<span className="text-gray-600 text-sm mt-1 cursor-pointer">
							Dont see your role? Create a role
						</span>
					</CreateRoleDialog>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					className="ml-4"
					padding="medium"
					disabled={adminCreateAttendeeMutation.isLoading}
				>
					{adminCreateAttendeeMutation.isLoading ? <LoadingInner /> : 'Create User'}
				</Button>
			</div>
		</form>
	);
};
