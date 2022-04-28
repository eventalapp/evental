import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseAttendeeQueryData } from '../../hooks/queries/useAttendeeQuery';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';
import { UseDeleteAttendeeMutationData } from '../../hooks/mutations/useDeleteAttendeeMutatation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseAttendeeQueryData &
	UseDeleteAttendeeMutationData;

export const DeleteAttendeeForm: React.FC<Props> = (props) => {
	const {
		attendee,
		isAttendeeLoading,
		attendeeError,
		deleteAttendeeError,
		deleteAttendeeMutation
	} = props;
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (isAttendeeLoading) {
		return <Loading />;
	}

	if (!attendee) {
		return <NotFound />;
	}

	if (attendeeError || deleteAttendeeError) {
		return <ViewServerError errors={[attendeeError, deleteAttendeeError]} />;
	}

	if (attendee.permissionRole === 'FOUNDER') {
		return (
			<div>
				<p>You cannot delete a founder</p>
			</div>
		);
	}

	return (
		<div>
			{attendee && (
				<form onSubmit={deleteAttendeeMutation.mutate}>
					<div className="flex flex-col w-full mt-5">
						<h1 className="text-2xl mb-3">
							Are you sure you would like to delete: {attendee.name}?
						</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<p className="font-bold mb-3">
									Please retype the role name below ({attendee.name}).
								</p>
								<Label htmlFor="name">Role Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									onChange={(event) => {
										setCanSubmit(event.target.value === attendee.name);
									}}
									required
								/>
							</div>
						</div>
					</div>

					<Button type="submit" disabled={!canSubmit}>
						Delete Attendee
					</Button>
				</form>
			)}
		</div>
	);
};
