import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { UseCreateRoleMutationData } from '../../hooks/mutations/useCreateRoleMutation';
import { ServerError } from '../ServerError';

type Props = {
	eid: string;
};

type CreateRoleFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseCreateRoleMutationData;

export const CreateRoleForm: React.FC<CreateRoleFormProps> = (props) => {
	const { eid, createRoleMutation, createRoleError, ...rest } = props;

	if (createRoleError) {
		return <ServerError errors={[createRoleError]} />;
	}

	return (
		<form onSubmit={createRoleMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Role Name</Label>
						<Input defaultValue="Role Name" id="name" name="name" type="text" required />
					</div>
					<div>
						<Label htmlFor="slug">Role Slug</Label>
						<Input defaultValue="role-slug" id="slug" name="slug" type="text" required />
					</div>
				</div>
			</div>

			<Button type="submit">Create Role</Button>
		</form>
	);
};
