import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditRoleMutationData } from '../../hooks/mutations/useEditRoleMutation';
import { UseRoleQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../form/ErrorMessage';
import { Controller, useForm } from 'react-hook-form';
import { EditRolePayload, EditRoleSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingInner } from '../error/LoadingInner';
import Switch from '../radix/components/Switch';
import { AttendeeWithUser } from '../../utils/stripUserPassword';

type Props = { eid: string; attendees: AttendeeWithUser[] } & UseRoleQueryData &
	Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseEditRoleMutationData;

export const EditRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { editRoleMutation, role } = props;
	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm<EditRolePayload>({
		defaultValues: {
			name: role?.name ?? undefined,
			defaultRole: role?.defaultRole ?? false
		},
		resolver: zodResolver(EditRoleSchema)
	});

	if (!role) return null;

	return (
		<form
			onSubmit={handleSubmit((data) => {
				editRoleMutation.mutate(data);
			})}
		>
			<div className="flex flex-row w-full mt-5 mt-3">
				<div className="mb-5 flex-1">
					<Label htmlFor="name">Role Name *</Label>
					<Input placeholder="Role name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div className="flex-initial ml-5">
					<Label htmlFor="defaultRole">Default Role</Label>
					<Controller
						control={control}
						name="defaultRole"
						render={({ field }) => (
							<Switch
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked);
								}}
							/>
						)}
					/>
					{errors.defaultRole?.message && (
						<ErrorMessage>{errors.defaultRole?.message}</ErrorMessage>
					)}
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
					disabled={editRoleMutation.isLoading}
				>
					{editRoleMutation.isLoading ? <LoadingInner /> : 'Edit Role'}
				</Button>
			</div>
		</form>
	);
};
