import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Select } from '../Form/Select';
import { Textarea } from '../Form/Textarea';
import { useVenuesQuery } from '../../hooks/queries/useVenuesQuery';
import { useActivityQuery } from '../../hooks/queries/useActivityQuery';
import { useEditActivityMutation } from '../../hooks/mutations/useEditActivityMutation';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';
import { Loading } from '../Loading';

type Props = {
	eid: string;
	aid: string;
};

type EditActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const EditActivityForm: React.FC<EditActivityFormProps> = (props) => {
	const { eid, aid, ...rest } = props;
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(eid);
	const { activity, isActivityLoading, activityError } = useActivityQuery(eid, aid);
	const { editActivityError, editActivityMutation } = useEditActivityMutation(eid, aid);

	if (isActivityLoading) {
		return <Loading />;
	}

	if (!activity) {
		return <NotFound />;
	}

	if (activityError || venuesError || editActivityError) {
		return <ServerError errors={[activityError, venuesError, editActivityError]} />;
	}

	return (
		<div>
			{activity && (
				<form onSubmit={editActivityMutation.mutate} {...rest}>
					<div className="flex flex-col w-full mt-5">
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input defaultValue={activity.name} id="name" name="name" type="text" required />
							</div>
							{isVenuesLoading ? (
								<div>Venues Loading...</div>
							) : (
								<div>
									{venues && venues.length <= 0 ? (
										<Link href={`/events/${eid}/admin/venues/create`}>
											<a className="text-red-600">No Venues exist, please create a Venue</a>
										</Link>
									) : (
										<>
											<Label htmlFor="venueId">Venue</Label>
											<Select name="venueId" defaultValue={activity.venueId} id="venueId" required>
												{venues &&
													venues.map((venue) => (
														<option key={venue.id} value={venue.id}>
															{venue.name}
														</option>
													))}
											</Select>
											<Link href={`/events/${eid}/admin/venues/create`}>
												<a className="text-blue-600">Dont see your venue? Create a Venue</a>
											</Link>
										</>
									)}
								</div>
							)}
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="slug">Slug</Label>
								<Input defaultValue={activity.slug} id="slug" name="slug" type="text" required />
							</div>
						</div>
						<div className="grid grid-cols-1 mb-5 gap-5">
							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									defaultValue={String(activity.description)}
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
									defaultValue={String(activity.startDate)}
									id="startDate"
									name="startDate"
									type="text"
									required
								/>
							</div>
							<div>
								<Label htmlFor="endDate">End Date</Label>
								<Input
									defaultValue={String(activity.endDate)}
									id="endDate"
									name="endDate"
									type="text"
									required
								/>
							</div>
						</div>
					</div>
					<Button type="submit" disabled={Boolean(venues && venues.length <= 0)}>
						Edit Activity
					</Button>
				</form>
			)}
		</div>
	);
};
