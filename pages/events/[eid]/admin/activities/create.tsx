import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
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

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));
	const { venues, isVenuesLoading } = useVenuesQuery(String(eid));

	const registerActivity = async (
		event: FormEvent<HTMLFormElement> & {
			target: {
				name: { value: string };
				location: { value: string };
				startDate: { value: string };
				endDate: { value: string };
				description: { value: string };
			};
		}
	) => {
		event.preventDefault();

		let createActivityResponse = await axios.post(`/api/events/${eid}/admin/activities/create`, {
			name: event.target.name.value,
			location: event.target.location.value,
			startDate: new Date(event.target.startDate.value).toISOString(),
			endDate: new Date(event.target.endDate.value).toISOString(),
			description: event.target.description.value
		});

		if (createActivityResponse.status === 200) {
			router.push(`/events/${eid}/activities/${createActivityResponse.data.id}`);
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
										<a className="text-blue-600">No Venues exist, please create a Venue</a>
									</Link>
								) : (
									<>
										<Label htmlFor="venue">Venue</Label>
										<Select name="venue" id="venue" required>
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
									defaultValue={new Date().toISOString().slice(0, 10)}
									id="startDate"
									name="startDate"
									type="date"
									required
								/>
							</div>
							<div>
								<Label htmlFor="endDate">End Date</Label>
								<Input
									defaultValue={new Date().toISOString().slice(0, 10)}
									id="endDate"
									name="endDate"
									type="date"
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
