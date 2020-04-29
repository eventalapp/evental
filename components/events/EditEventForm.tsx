import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { ViewServerError } from '../ViewServerError';
import { UseEditEventMutationData } from '../../hooks/mutations/useEditEventMutation';
import { Loading } from '../Loading';
import { NotFound } from '../NotFound';
import PageWrapper from '../layout/PageWrapper';

type Props = {
	eid: string;
} & DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseEditEventMutationData;

export const EditEventForm: React.FC<Props> = (props) => {
	const { eid, editEventMutation, editEventError, event, eventError, isEventLoading, ...rest } =
		props;

	if (isEventLoading) {
		return <Loading />;
	}

	if (editEventError || eventError) {
		return <ViewServerError errors={[editEventError, eventError]} />;
	}

	if (!event) {
		return <NotFound />;
	}

	return (
		<form onSubmit={editEventMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue={event.name} id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							defaultValue={event.location}
							id="location"
							name="location"
							type="text"
							required
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue={String(event.description)}
							id="description"
							name="description"
							type="text"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="startDate">Start Date</Label>
						<Input
							defaultValue={String(event.startDate)}
							id="startDate"
							name="startDate"
							type="text"
							required
						/>
					</div>
					<div>
						<Label htmlFor="endDate">End Date</Label>
						<Input
							defaultValue={String(event.endDate)}
							id="endDate"
							name="endDate"
							type="text"
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit">Edit Event</Button>
		</form>
	);
};
