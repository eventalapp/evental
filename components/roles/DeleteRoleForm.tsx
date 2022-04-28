import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { ViewServerError } from '../ViewServerError';
import { UseRoleAttendeesQueryData } from '../../hooks/queries/useRoleAttendeesQuery';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import { UseDeleteRoleMutationData } from '../../hooks/mutations/useDeleteRoleMutation';

type Props = Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'role'> &
	UseDeleteRoleMutationData &
	UseRoleAttendeesQueryData;

export const DeleteRoleForm: React.FC<Props> = (props) => {
	const {
		deleteRoleMutation,
		deleteRoleError,
		role,
		attendees,
		roleAttendeesError,
		isRoleAttendeesLoading
	} = props;
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (deleteRoleError || roleAttendeesError) {
		return <ViewServerError errors={[deleteRoleError, roleAttendeesError]} />;
	}

	if (isRoleAttendeesLoading) {
		return <Loading />;
	}

	if (!role || !attendees) {
		return <NotFound />;
	}

	return (
		<form onSubmit={deleteRoleMutation.mutate}>
			<div className="flex flex-col w-full mt-5">
				<h1 className="text-2xl mb-3">Are you sure you would like to delete: {role.name}?</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<p className="font-bold mb-3">Please retype the role name below ({role.name}).</p>
						<Label htmlFor="name">Role Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							onChange={(event) => {
								setCanSubmit(event.target.value === role.name);
							}}
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit" disabled={!canSubmit}>
				Delete Role
			</Button>
		</form>
	);
};
