import { zodResolver } from '@hookform/resolvers/zod';
import { EventPermissionRole } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useEditAttendeeMutation } from '../../hooks/mutations/useEditAttendeeMutation';
import { useImageUploadMutation } from '../../hooks/mutations/useImageUploadMutation';
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

type Props = {
	eid: string;
	uid: string;
	attendee: UseAttendeeQueryData['attendee'];
	roles: UseRolesQueryData['roles'];
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const AdminEditAttendeeForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { attendee, roles, eid, uid } = props;
	const { adminEditAttendeeMutation } = useEditAttendeeMutation(String(eid), String(uid));
	const { imageUploadMutation } = useImageUploadMutation();
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
						<ErrorMessage>{errors.eventRoleId?.message}</ErrorMessage>
					)}

					<CreateRoleDialog eid={String(eid)}>
						<span className="mt-1 cursor-pointer text-sm text-gray-600">
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
