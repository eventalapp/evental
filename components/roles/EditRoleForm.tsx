import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEditRoleMutationData } from '../../hooks/mutations/useEditRoleMutation';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { useRouter } from 'next/router';
import { ErrorMessage } from '../form/ErrorMessage';
import { useForm } from 'react-hook-form';
import { EditRolePayload, EditRoleSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = { eid: string } & UseRoleAttendeesQueryData &
	Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseEditRoleMutationData;

export const EditRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { editRoleMutation, role } = props;
	const {
		register,
		handleSubmit,

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
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name *</Label>
						<Input placeholder="Role name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
				</div>
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input type="checkbox" placeholder="event-slug" {...register('defaultRole')} />
					{errors.defaultRole?.message && (
						<ErrorMessage>{errors.defaultRole?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Create Role
				</Button>
			</div>
		</form>
	);
};
