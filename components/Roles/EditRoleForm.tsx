import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { ServerError } from '../ServerError';
import { useEditRoleMutation } from '../../hooks/mutations/useEditRoleMutation';
import { useRoleQuery } from '../../hooks/queries/useRoleQuery';

interface Props {
	eid: string;
	rid: string;
}

type EditRoleFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditRoleForm: React.FC<EditRoleFormProps> = (props) => {
	const { eid, rid, ...rest } = props;
	const { editRoleMutation, editRoleError } = useEditRoleMutation(String(eid), String(rid));
	const { role, roleError, isRoleLoading } = useRoleQuery(eid, rid);

	if (editRoleError) {
		return <ServerError error={editRoleError} />;
	}

	if (isRoleLoading) {
		return (
			<div>
				<p>Role loading...</p>
			</div>
		);
	}

	if (!role) {
		return (
			<div>
				<p>Role not found.</p>
			</div>
		);
	}

	if (roleError) {
		return <ServerError error={roleError} />;
	}

	return (
		<form onSubmit={editRoleMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role</Label>
						<Input defaultValue={role.name} id="name" name="name" type="text" required />
					</div>
					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input defaultValue={role.slug} id="slug" name="slug" type="text" required />
					</div>
				</div>
			</div>

			<Button type="submit">Create Role</Button>
		</form>
	);
};
