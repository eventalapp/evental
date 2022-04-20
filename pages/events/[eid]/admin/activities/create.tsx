import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import Column from '../../../../../components/Column';
import { Navigation } from '../../../../../components/Navigation';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const { eid } = router.query;

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

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<h1 className="text-3xl">Create Activity Page</h1>
				<form onSubmit={registerActivity}>
					<label htmlFor="name">Name</label>
					<input
						defaultValue="Activity Name"
						id="name"
						name="name"
						type="text"
						required
						className="border-2"
					/>
					<label htmlFor="name">Location</label>
					<input
						defaultValue="Activity Location"
						id="location"
						name="location"
						type="text"
						required
						className="border-2"
					/>
					<label htmlFor="name">Description</label>
					<input
						defaultValue="Activity Description"
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
					<button type="submit">Register Activity</button>
				</form>
			</Column>
		</>
	);
};

export default CreateActivityPage;
