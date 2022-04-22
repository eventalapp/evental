import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { ZodError } from 'zod';
import { BackButton } from '../../../../components/BackButton';
import Column from '../../../../components/Column';
import { UpdateEventForm } from '../../../../components/Form/Event/UpdateEventForm';
import { Navigation } from '../../../../components/Navigation';
import Unauthorized from '../../../../components/Unauthorized';
import { getFormEntries } from '../../../../utils/getFormEntries';
import { UpdateEventSchema } from '../../../../utils/schemas';

const CreateEventPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;

	const updateEvent = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = UpdateEventSchema.parse(formEntries);

			const updateEventResponse = await axios.put(`/api/events/${eid}/admin/edit`, {
				name: eventParsed.name,
				location: eventParsed.location,
				startDate: new Date(eventParsed.startDate).toISOString(),
				endDate: new Date(eventParsed.endDate).toISOString(),
				description: eventParsed.description
			});

			if (updateEventResponse.status === 200) {
				router.push(`/events/${updateEventResponse.data.id}`);
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

				<h1 className="text-3xl">Update Event Page</h1>

				<UpdateEventForm onSubmit={updateEvent} eid={String(eid)} />
			</Column>
		</>
	);
};

export default CreateEventPage;
