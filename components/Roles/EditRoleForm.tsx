import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { ServerError } from '../ServerError';
import { UseEditRoleMutationData } from '../../hooks/mutations/useEditRoleMutation';

import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';

type Props = {
	eid: string;
	rid: string;
} & UseRoleAttendeesQueryData &
	Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseEditRoleMutationData;

export const EditRoleForm: React.FC<Props> = (props) => {
	const {
		eid,
		rid,
		editRoleMutation,
		editRoleError,
		role,
		roleAttendeesError,
		isRoleAttendeesLoading,

		...rest
	} = props;

	if (isRoleAttendeesLoading) {
		return <Loading />;
	}

	if (!role) {
		return <NotFound />;
	}

	if (roleAttendeesError || editRoleError) {
		return <ServerError errors={[roleAttendeesError, editRoleError]} />;
	}

	return (
		<form onSubmit={editRoleMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
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
			</div>

			<Button type="submit">Create Role</Button>
		</form>
	);
};
