import axios from 'axios';
import Link from 'next/link';
import router from 'next/router';
import React, { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';

import { getFormEntries } from '../../../utils/getFormEntries';
import { CreateActivityPayload, CreateActivitySchema } from '../../../utils/schemas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { useVenuesQuery } from '../../../hooks/queries/useVenuesQuery';

interface Props {
	eid: string;
}

type CreateActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateActivityForm: React.FC<CreateActivityFormProps> = (props) => {
	const { eid, ...rest } = props;
	const { venues, isVenuesLoading, venuesError } = useVenuesQuery(String(eid));

	const registerActivity = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			let eventParsed = CreateActivitySchema.parse(formEntries);

			//TODO: Use react query mutation

			const body: CreateActivityPayload = {
				slug: eventParsed.slug,
				name: eventParsed.name,
				venueId: eventParsed.venueId,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			};

			let createActivityResponse = await axios.post(
				`/api/events/${eid}/admin/activities/create`,
				body
			);

			if (createActivityResponse.status === 200) {
				router.push(`/events/${eid}/activities/${createActivityResponse.data.slug}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

	if (venuesError) {
		<div>
			<p className="text-red-500">Venues: {venuesError}</p>
		</div>;
	}

	return (
		<form onSubmit={registerActivity} {...rest}>
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
