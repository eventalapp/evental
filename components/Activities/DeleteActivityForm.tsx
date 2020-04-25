import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { useActivityQuery } from '../../hooks/queries/useActivityQuery';
import { useDeleteActivityMutation } from '../../hooks/mutations/useDeleteActivityMutation';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';

type Props = {
	eid: string;
	aid: string;
};

type DeleteActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const DeleteActivityForm: React.FC<DeleteActivityFormProps> = (props) => {
	const { eid, aid } = props;
	const { activity, isActivityLoading, activityError } = useActivityQuery(eid, aid);
	const { deleteActivityError, deleteActivityMutation } = useDeleteActivityMutation(eid, aid);
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (isActivityLoading) {
		return <Loading />;
	}

	if (!activity) {
		return <NotFound />;
	}

	if (activityError || deleteActivityError) {
		return <ServerError errors={[activityError, deleteActivityError]} />;
	}

	return (
		<div>
			{activity && (
				<form onSubmit={deleteActivityMutation.mutate}>
					<div className="flex flex-col w-full mt-5">
						<h1 className="text-2xl mb-3">
							Are you sure you would like to delete: {activity.name}?
						</h1>

						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<p className="font-bold mb-3">
									Please retype the activity name below ({activity.name}).
								</p>
								<Label htmlFor="name">Activity Name</Label>
								<Input
									id="name"
									name="name"
									type="text"
									onChange={(event) => {
										setCanSubmit(event.target.value === activity.name);
									}}
									required
								/>
							</div>
						</div>
					</div>

					<Button type="submit" disabled={!canSubmit}>
						Delete Activity
					</Button>
				</form>
			)}
		</div>
	);
};
