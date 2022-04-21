import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { ZodError } from 'zod';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { Button } from '../../../../../components/Form/Button';
import { Input } from '../../../../../components/Form/Input';
import { Label } from '../../../../../components/Form/Label';
import { Select } from '../../../../../components/Form/Select';
import { Textarea } from '../../../../../components/Form/Textarea';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';
import { useVenuesQuery } from '../../../../../hooks/useVenuesQuery';
import { getFormEntries } from '../../../../../utils/getFormEntries';
import { CreateActivitySchema } from '../../../../../utils/schemas';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading } = useVenuesQuery(String(eid));

	const registerActivity = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			let eventParsed = CreateActivitySchema.parse(formEntries);

			let createActivityResponse = await axios.post(`/api/events/${eid}/admin/activities/create`, {
				name: eventParsed.name,
				venueId: eventParsed.venueId,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			});

			if (createActivityResponse.status === 200) {
				router.push(`/events/${eid}/activities/${createActivityResponse.data.id}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

	//TODO: Use react query mutation

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	if (!isOrganizerLoading && !isOrganizer) {
		return <NoAccess />;
	}

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Create Activity Page</h1>
				<form onSubmit={registerActivity}>
					<div className="flex flex-col w-full mt-5">
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input defaultValue="Activity Name" id="name" name="name" type="text" required />
							</div>

							<div>
								{venues && venues.length <= 0 ? (
									<Link href={`/events/${eid}/admin/venues/create`}>
										<a className="text-red-600">No Venues exist, please create a Venue</a>
									</Link>
								) : (
									<>
										<Label htmlFor="venueId">Venue</Label>
										<Select name="venueId" id="venueId" required>
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
			</Column>
		</>
	);
};

export default CreateActivityPage;
