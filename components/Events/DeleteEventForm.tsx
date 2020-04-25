import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { ServerError } from '../ServerError';
import { UseDeleteEventMutationData } from '../../hooks/mutations/useDeleteEventMutation';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';

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
		return <ServerError errors={[deleteEventError, eventError]} />;
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
							onChange={(e) => {
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
