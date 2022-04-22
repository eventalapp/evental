import { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';

type CreateEventFormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const CreateEventForm: React.FC<CreateEventFormProps> = (props) => {
	const { ...rest } = props;

	return (
		<form {...rest}>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input defaultValue="Activity Name" id="name" name="name" type="text" required />
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							defaultValue="Activity Location"
							id="location"
							name="location"
							type="text"
							required
						/>
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
							defaultValue={new Date().toISOString()}
							id="startDate"
							name="startDate"
							type="text"
							required
						/>
					</div>
					<div>
						<Label htmlFor="endDate">End Date</Label>
						<Input
							defaultValue={new Date().toISOString()}
							id="endDate"
							name="endDate"
							type="text"
							required
						/>
					</div>
				</div>
			</div>

			<Button type="submit">Register Event</Button>
		</form>
	);
};
