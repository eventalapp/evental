import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Form/Button';
import { Input } from '../Form/Input';
import { Label } from '../Form/Label';
import { Select } from '../Form/Select';
import { Textarea } from '../Form/Textarea';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { UseCreateActivityMutationData } from '../../hooks/mutations/useCreateActivityMutation';
import { Loading } from '../Loading';
import { ServerError } from '../ServerError';
import { NotFound } from '../NotFound';

type Props = {
	eid: string;
};

type CreateActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenuesQueryData &
	UseCreateActivityMutationData;

export const CreateActivityForm: React.FC<CreateActivityFormProps> = (props) => {
	const {
		eid,
		isVenuesLoading,
		venuesError,
		venues,
		createActivityError,
		createActivityMutation,
		...rest
	} = props;

	if (venuesError) {
		return (
			<div>
				<p className="text-red-500">Venues: {venuesError}</p>
			</div>
		);
	}

	if (isVenuesLoading) {
		return <Loading />;
	}

	if (venuesError || createActivityError) {
		return <ServerError errors={[venuesError, createActivityError]} />;
	}

	if (!venues) {
		return <NotFound />;
	}

	return (
		<form onSubmit={createActivityMutation.mutate} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue="Activity Name" id="name" name="name" type="text" required />
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
									<Select
										name="venueId"
										defaultValue={venues && venues[0].id}
										id="venueId"
										required
									>
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
						<Input defaultValue="activity-slug" id="slug" name="slug" type="text" required />
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							defaultValue="Activity Description"
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
							defaultValue={new Date().toISOString()}
							id="startDate"
							name="startDate"
							type="text"
							required
						/>
					</div>
					<div>
						<Label htmlFor="endDate">End Date</Label>
						<Input
							defaultValue={new Date().toISOString()}
							id="endDate"
							name="endDate"
							type="text"
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit" disabled={Boolean(venues && venues.length <= 0)}>
				Create Activity
			</Button>
		</form>
	);
};
