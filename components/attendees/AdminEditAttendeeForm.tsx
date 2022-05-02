import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { AdminEditAttendeePayload, AdminEditAttendeeSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { Label } from '../form/Label';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { UseEditAttendeeMutationData } from '../../hooks/mutations/useAdminEditAttendeeMutation';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import { Select } from '../form/Select';
import Link from 'next/link';
import { EventPermissionRole } from '@prisma/client';
import { UseImageUploadMutationData } from '../../hooks/mutations/useImageUploadMutation';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../form/ErrorMessage';

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
		register,
		handleSubmit,
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
					<Select {...register('eventRoleId', { required: true })}>
						{roles &&
							roles.map((role) => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
					</Select>
					{errors.eventRoleId?.message && (
						<ErrorMessage>{errors.eventRoleId?.message}</ErrorMessage>
					)}
					<Link href={`/events/${eid}/admin/roles/create`}>
						<a className="text-gray-600 block mt-1 text-sm">Dont see your role? Create a role</a>
					</Link>
				</div>
				<div>
					<Label htmlFor="permissionRole">Permission Role *</Label>
					<Select {...register('permissionRole', { required: true })}>
						{EventPermissionRole &&
							Object.values(EventPermissionRole).map((role) => (
								<option key={role} value={role}>
									{role}
								</option>
							))}
					</Select>
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
					Edit
				</Button>
			</div>
		</form>
	);
};
