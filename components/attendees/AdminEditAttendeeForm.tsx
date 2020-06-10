import { zodResolver } from '@hookform/resolvers/zod';
import { EventPermissionRole } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { UseEditAttendeeMutationData } from '../../hooks/mutations/useEditAttendeeMutation';
import { UseImageUploadMutationData } from '../../hooks/mutations/useImageUploadMutation';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { AdminEditAttendeePayload, AdminEditAttendeeSchema } from '../../utils/schemas';
import { capitalizeFirstLetter } from '../../utils/string';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Label } from '../form/Label';
import CreateRoleDialog from '../radix/components/CreateRoleDialog';
import Select from '../radix/components/Select';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseEditAttendeeMutationData &
	UseAttendeeQueryData &
	UseRolesQueryData &
	UseImageUploadMutationData;

export const AdminEditAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { adminEditAttendeeMutation, attendee, roles, eid, imageUploadMutation } = props;
	const {
		handleSubmit,
		control,
		setValue,
		formState: { errors }
	} = useForm<AdminEditAttendeePayload>({
		defaultValues: {
			eventRoleId: attendee?.eventRoleId ?? undefined,
			permissionRole: attendee?.permissionRole ?? undefined
		},
		resolver: zodResolver(AdminEditAttendeeSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				adminEditAttendeeMutation.mutate(data);
			})}
		>
			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5 mt-3">
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
				<div>
					<Label htmlFor="permissionRole">Permission Role *</Label>

					{EventPermissionRole && (
						<Controller
							control={control}
							name="permissionRole"
							render={({ field }) => (
								<Select
									options={Object.values(EventPermissionRole).map((role) => ({
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

					{errors.permissionRole?.message && (
						<ErrorMessage>{errors.permissionRole?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					className="ml-4"
					disabled={imageUploadMutation.isLoading}
				>
					{adminEditAttendeeMutation.isLoading ? <LoadingInner /> : 'Edit'}
				</Button>
			</div>
		</form>
	);
};
