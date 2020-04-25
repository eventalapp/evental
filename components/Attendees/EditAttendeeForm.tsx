import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Select } from '../Form/Select';
import { Textarea } from '../Form/Textarea';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { UseEditAttendeeMutationData } from '../../hooks/mutations/useEditAttendeeMutation';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';

type Props = {
	eid: string;
	aid: string;
};

type EditAttendeeFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseAttendeeQueryData &
	UseEditAttendeeMutationData &
	UseRolesQueryData;

export const EditAttendeeForm: React.FC<EditAttendeeFormProps> = (props) => {
	const {
		eid,
		aid,
		attendee,
		isAttendeeLoading,
		attendeeError,
		editAttendeeError,
		editAttendeeMutation,
		rolesError,
		roles,
		isRolesLoading,
		...rest
	} = props;

	if (isAttendeeLoading || isRolesLoading) {
		return <Loading />;
	}

	if (!attendee) {
		return <NotFound />;
	}

	if (attendeeError || editAttendeeError || rolesError) {
		return <ServerError errors={[attendeeError, editAttendeeError, rolesError]} />;
	}

	return (
		<div>
			{attendee && (
				<form onSubmit={editAttendeeMutation.mutate} {...rest}>
					<div className="flex flex-col w-full mt-5">
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input defaultValue={attendee.name} id="name" name="name" type="text" required />
							</div>

							<div>
								{roles && roles.length <= 0 ? (
									<Link href={`/events/${eid}/admin/roles/create`}>
										<a className="text-red-600">No Roles exist, please create a role</a>
									</Link>
								) : (
									<>
										<Label htmlFor="eventRoleId">Role</Label>
										<Select
											defaultValue={attendee.eventRoleId}
											name="eventRoleId"
											id="eventRoleId"
											required
										>
											{roles &&
												roles.map((role) => (
													<option key={role.id} value={role.id}>
														{role.name}
													</option>
												))}
										</Select>
										<Link href={`/events/${eid}/admin/roles/create`}>
											<a className="text-blue-600">Dont see your role? Create a role</a>
										</Link>
									</>
								)}
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="slug">Slug</Label>
								<Input defaultValue={attendee.slug} id="slug" name="slug" type="text" required />
							</div>
						</div>
						<div className="grid grid-cols-1 mb-5 gap-5">
							<div>
								<Label htmlFor="description">Position</Label>
								<Textarea
									defaultValue={String(attendee.position ?? '')}
									id="position"
									name="position"
									type="text"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="company">Company</Label>
								<Input
									defaultValue={String(attendee.company ?? '')}
									id="company"
									name="company"
									type="text"
								/>
							</div>
						</div>
					</div>

					<Button type="submit" disabled={Boolean(roles && roles.length <= 0)}>
						Edit Attendee
					</Button>
				</form>
			)}
		</div>
	);
};
