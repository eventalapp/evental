import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { ViewServerError } from '../ViewServerError';
import { UseEditRoleMutationData } from '../../hooks/mutations/useEditRoleMutation';

import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';

type Props = UseRoleAttendeesQueryData &
	Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseEditRoleMutationData;

export const EditRoleForm: React.FC<Props> = (props) => {
	const { editRoleMutation, editRoleError, role, roleAttendeesError, isRoleAttendeesLoading } =
		props;

	if (isRoleAttendeesLoading) {
		return <Loading />;
	}

	if (!role) {
		return <NotFound />;
	}

	if (roleAttendeesError) {
		return <ViewServerError errors={[roleAttendeesError]} />;
	}

	return (
		<form onSubmit={editRoleMutation.mutate}>
			<div className="flex flex-col w-full mt-5">
				{editRoleError && <ViewServerError errors={[editRoleError]} />}
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name</Label>
						<Input defaultValue={role.name} id="name" name="name" type="text" required />
					</div>
					<div>
						<Label htmlFor="slug">Role Slug</Label>
						<Input defaultValue={role.slug} id="slug" name="slug" type="text" required />
					</div>
				</div>
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input
						type="checkbox"
						defaultChecked={role.defaultRole}
						id="defaultRole"
						name="defaultRole"
					/>
				</div>
			</div>

			<Button type="submit">Edit Role</Button>
		</form>
	);
};
