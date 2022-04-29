import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { ViewServerError } from '../ViewServerError';
import { UseDeleteEventMutationData } from '../../hooks/mutations/useDeleteEventMutation';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import PageWrapper from '../layout/PageWrapper';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseDeleteEventMutationData;

export const DeleteEventForm: React.FC<Props> = (props) => {
	const { deleteEventMutation, deleteEventError, event, eventError, isEventLoading } = props;
	const [canSubmit, setCanSubmit] = React.useState(false);

	if (isEventLoading) {
		return <Loading />;
	}

	if (deleteEventError || eventError) {
		return <ViewServerError errors={[deleteEventError, eventError]} />;
	}

	if (!event) {
		return <NotFound />;
	}

	return (
		<form onSubmit={deleteEventMutation.mutate}>
			<div className="flex flex-col w-full mt-5">
				<h1 className="text-2xl mb-3">Are you sure you would like to delete: {event.name}?</h1>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<p className="font-bold mb-3">Please retype the event name below ({event.name}).</p>
						<Label htmlFor="name">Event Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								setCanSubmit(e.target.value === event.name);
							}}
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit" disabled={!canSubmit}>
				Delete Event
			</Button>
		</form>
	);
};
