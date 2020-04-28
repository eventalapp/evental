import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseActivityQueryData } from '../../hooks/queries/useActivityQuery';
import { UseDeleteActivityMutationData } from '../../hooks/mutations/useDeleteActivityMutation';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseDeleteActivityMutationData &
	UseActivityQueryData;

export const DeleteActivityForm: React.FC<Props> = (props) => {
	const {
		activity,
		isActivityLoading,
		activityError,
		deleteActivityError,
		deleteActivityMutation
	} = props;

	const [canSubmit, setCanSubmit] = React.useState(false);

	if (isActivityLoading) {
		return <Loading />;
	}

	if (!activity) {
		return <NotFound />;
	}

	if (activityError || deleteActivityError) {
		return <ViewServerError errors={[activityError, deleteActivityError]} />;
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
									onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
