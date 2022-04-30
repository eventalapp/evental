import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseCreateRoleMutationData } from '../../hooks/mutations/useCreateRoleMutation';
import { useRouter } from 'next/router';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseCreateRoleMutationData;

export const CreateRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createRoleMutation } = props;

	return (
		<form onSubmit={createRoleMutation.mutate}>
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
				<div>
					<Label htmlFor="defaultRole">Default Role</Label>
					<Input type="checkbox" defaultChecked={false} id="defaultRole" name="defaultRole" />
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
