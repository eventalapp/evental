import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Column from '../../components/Column';

const CreateEventPage: NextPage = () => {
	const registerUser = async (event: any) => {
		event.preventDefault();

		let createResponse = await axios.post('/api/events/create', {
			name: event.target.name.value,
			location: event.target.location.value,
			startDate: event.target.startDate.value,
			endDate: event.target.endDate.value,
			description: event.target.description.value
		});

		console.log(createResponse);
	};

	return (
		<Column className="py-10">
			<Head>
				<title>Create event</title>
			</Head>

			<h1 className="text-3xl">Create Event Page</h1>

			<form onSubmit={registerUser}>
				<label htmlFor="name">Name</label>
				<input id="name" name="name" type="text" required className="border-2" />

				<label htmlFor="name">Location</label>
				<input id="location" name="location" type="text" required className="border-2" />

				<label htmlFor="name">Description</label>
				<input id="description" name="description" type="text" required className="border-2" />

				<label htmlFor="name">Start Date</label>
				<input id="startDate" name="startDate" type="text" required className="border-2" />

				<label htmlFor="name">End Date</label>
				<input id="endDate" name="endDate" type="text" required className="border-2" />

				<button type="submit">Register Event</button>
			</form>
		</Column>
	);
};

export default CreateEventPage;
