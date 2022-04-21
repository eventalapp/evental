import axios from 'axios';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';
import { ZodError } from 'zod';
import { BackButton } from '../../../../../components/BackButton';
import Column from '../../../../../components/Column';
import { Button } from '../../../../../components/Form/Button';
import { Input } from '../../../../../components/Form/Input';
import { Label } from '../../../../../components/Form/Label';
import { Textarea } from '../../../../../components/Form/Textarea';
import { Navigation } from '../../../../../components/Navigation';
import NoAccess from '../../../../../components/NoAccess';
import Unauthorized from '../../../../../components/Unauthorized';
import { useOrganizerQuery } from '../../../../../hooks/useOrganizerQuery';
import { CreateVenueSchema } from '../../../../../utils/schemas';

const CreateActivityPage: NextPage = () => {
	const router = useRouter();
	const session = useSession();
	const { eid } = router.query;
	const { isOrganizer, isOrganizerLoading } = useOrganizerQuery(String(eid));

	const createVenue = async (
		event: FormEvent<HTMLFormElement> & {
			target: unknown;
		}
	) => {
		event.preventDefault();

		let formattedObject: { [key: string]: string } = {};

		Object.entries(event.target).forEach(([, value]) => {
			if (value.tagName === 'INPUT' || value.tagName === 'TEXTAREA') {
				formattedObject[value.name] = value.value;
			}
		});

		try {
			let eventParsed = CreateVenueSchema.parse(formattedObject);

			let createVenueResponse = await axios.post(`/api/events/${eid}/admin/venues/create`, {
				name: eventParsed.name,
				description: eventParsed.description
			});

			if (createVenueResponse.status === 200) {
				router.push(`/events/${eid}/venues/${createVenueResponse.data.id}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

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

				<h1 className="text-3xl">Create Venue Page (WIP)</h1>
				<form onSubmit={createVenue}>
					<div className="flex flex-col w-full mt-5">
						<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input defaultValue="Venue Name" id="name" name="name" type="text" required />
							</div>
						</div>

						<div className="grid grid-cols-1 mb-5 gap-5">
							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									defaultValue="Venue Description"
									id="description"
									name="description"
									type="text"
								/>
							</div>
						</div>
					</div>

					<Button type="submit">Create Venue</Button>
				</form>
			</Column>
		</>
	);
};

export default CreateActivityPage;
