import axios from 'axios';
import router from 'next/router';
import React, { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';
import { getFormEntries } from '../../../utils/getFormEntries';
import { CreateVenuePayload, CreateVenueSchema } from '../../../utils/schemas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';

interface Props {
	eid: string;
}

type CreateActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateVenueForm: React.FC<CreateActivityFormProps> = (props) => {
	const { eid, ...rest } = props;

	const createVenue = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = CreateVenueSchema.parse(formEntries);

			const body: CreateVenuePayload = {
				slug: eventParsed.slug,
				name: eventParsed.name,
				description: eventParsed.description
			};

			const createVenueResponse = await axios.post(`/api/events/${eid}/admin/venues/create`, body);

			if (createVenueResponse.status === 200) {
				router.push(`/events/${eid}/venues/${createVenueResponse.data.slug}`);
			}
		} catch (error) {
			if (error instanceof ZodError) {
				alert('error');
				console.error(error);
			}
		}
	};

	return (
		<form onSubmit={createVenue} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue="Venue Name" id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input defaultValue="venue-slug" id="slug" name="slug" type="text" required />
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
	);
};
