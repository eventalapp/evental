import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { ZodError } from 'zod';
import { BackButton } from '../../components/BackButton';
import Column from '../../components/Column';
import { CreateEventForm } from '../../components/Form/Event/CreateEventForm';
import { Navigation } from '../../components/Navigation';
import Unauthorized from '../../components/Unauthorized';
import { getFormEntries } from '../../utils/getFormEntries';
import { CreateEventSchema } from '../../utils/schemas';

const CreateEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();

	const createEvent = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = CreateEventSchema.parse(formEntries);

			const createEventResponse = await axios.post('/api/events/create', {
				name: eventParsed.name,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			});

			if (createEventResponse.status === 200) {
				router.push(`/events/${createEventResponse.data.id}`);
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

	return (
		<>
			<Head>
				<title>Create event</title>
			</Head>

			<Navigation />

			<Column className="py-10">
				<BackButton />

				<h1 className="text-3xl">Create Event Page</h1>

				<CreateEventForm onSubmit={createEvent} />
			</Column>
		</>
	);
};

export default CreateEventPage;
