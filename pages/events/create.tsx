import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import Column from '../../components/Column';
import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { Label } from '../../components/Form/Label';
import { Textarea } from '../../components/Form/Textarea';
import { Navigation } from '../../components/Navigation';
import Unauthorized from '../../components/Unauthorized';

const CreateEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();

	const createEvent = async (
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

		let createResponse = await axios.post('/api/events/create', {
			name: event.target.name.value,
			location: event.target.location.value,
			startDate: new Date(event.target.startDate.value).toISOString(),
			endDate: new Date(event.target.endDate.value).toISOString(),
			description: event.target.description.value
		});

		if (createResponse.status === 200) {
			router.push(`/events/${createResponse.data.id}`);
		}
	};

	//TODO: Use react query mutation

	if (!session.data?.user?.id) {
		return <Unauthorized />;
	}

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<h1 className="text-3xl">Create Event Page</h1>
				<form onSubmit={createEvent}>
					<div className="flex flex-col w-full mt-5">
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input defaultValue="Event Name" id="name" name="name" type="text" required />
							</div>

							<div>
								<Label htmlFor="name">Location</Label>
								<Input
									defaultValue="Event Location"
									id="location"
									name="location"
									type="text"
									required
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Description</Label>
								<Textarea
									defaultValue="Event Description"
									id="description"
									name="description"
									type="text"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Start Date</Label>
								<Input
									defaultValue={new Date().toISOString().slice(0, 10)}
									id="startDate"
									name="startDate"
									type="date"
									required
								/>
							</div>
							<div>
								<Label htmlFor="name">End Date</Label>
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

					<Button type="submit">Register Event</Button>
				</form>
			</Column>
		</>
	);
};

export default CreateEventPage;
