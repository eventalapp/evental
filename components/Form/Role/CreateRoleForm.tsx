import axios from 'axios';
import router from 'next/router';
import { DetailedHTMLProps, FormEvent, FormHTMLAttributes } from 'react';
import { ZodError } from 'zod';
import { getFormEntries } from '../../../utils/getFormEntries';
import { CreateRolePayload, CreateRoleSchema } from '../../../utils/schemas';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';

interface Props {
	eid: string;
}

type CreateRoleFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateRoleForm: React.FC<CreateRoleFormProps> = (props) => {
	const { eid, ...rest } = props;

	const createVenue = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			const formEntries = getFormEntries(event);

			const eventParsed = CreateRoleSchema.parse(formEntries);

			const body: CreateRolePayload = {
				role: eventParsed.role
			};

			const createVenueResponse = await axios.post(`/api/events/${eid}/admin/roles/create`, body);

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

	return (
		<form onSubmit={createVenue} {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="role">Role</Label>
						<Input defaultValue="Role Name" id="role" name="role" type="text" required />
					</div>
				</div>
			</div>

			<Button type="submit">Create Role</Button>
		</form>
	);
};
