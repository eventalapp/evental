import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Select } from '../form/Select';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { UseEditAttendeeMutationData } from '../../hooks/mutations/useEditAttendeeMutation';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { UseRolesQueryData } from '../../hooks/queries/useRolesQuery';
import PageWrapper from '../layout/PageWrapper';

type Props = {
	eid: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseAttendeeQueryData &
	UseEditAttendeeMutationData &
	UseRolesQueryData;

export const EditAttendeeForm: React.FC<Props> = (props) => {
	const {
		eid,
		attendee,
		isAttendeeLoading,
		attendeeError,
		editAttendeeError,
		editAttendeeMutation,
		rolesError,
		roles,
		isRolesLoading
	} = props;

	if (isAttendeeLoading || isRolesLoading) {
		return (
			<PageWrapper>
				<Loading />
			</PageWrapper>
		);
	}

	if (!attendee) {
		return <NotFound />;
	}

	if (attendeeError || editAttendeeError || rolesError) {
		return <ViewServerError errors={[attendeeError, editAttendeeError, rolesError]} />;
	}

	return (
		<div>
			{attendee && (
				<form onSubmit={editAttendeeMutation.mutate}>
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
											<a className="text-gray-600">Dont see your role? Create a role</a>
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
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="description">Position</Label>
								<Input
									defaultValue={String(attendee.position ?? '')}
									id="position"
									name="position"
									type="text"
								/>
							</div>
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
