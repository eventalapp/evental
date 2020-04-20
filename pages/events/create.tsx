import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import Column from '../../components/Column';
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
					<label htmlFor="name">Name</label>
					<input
						defaultValue="Event Name"
						id="name"
						name="name"
						type="text"
						required
						className="border-2"
					/>
					<label htmlFor="name">Location</label>
					<input
						defaultValue="Event Location"
						id="location"
						name="location"
						type="text"
						required
						className="border-2"
					/>
					<label htmlFor="name">Description</label>
					<input
						defaultValue="Event Description"
						id="description"
						name="description"
						type="text"
						className="border-2"
					/>
					<label htmlFor="name">Start Date</label>
					<input
						defaultValue={new Date().toISOString().slice(0, 10)}
						id="startDate"
						name="startDate"
						type="date"
						required
						className="border-2"
					/>
					<label htmlFor="name">End Date</label>
					<input
						defaultValue={new Date().toISOString().slice(0, 10)}
						id="endDate"
						name="endDate"
						type="date"
						required
						className="border-2"
					/>
					<button type="submit">Register Event</button>
				</form>
			</Column>
		</>
	);
};

export default CreateEventPage;
