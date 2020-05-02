import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseCreateVenueMutationData } from '../../hooks/mutations/useCreateVenueMutation';
import { useForm } from 'react-hook-form';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '../form/ErrorMessage';
import { useRouter } from 'next/router';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateVenueMutationData;

export const CreateVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { createVenueMutation } = props;

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateVenuePayload>({
		resolver: zodResolver(CreateVenueSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createVenueMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Venue name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
				</div>

				<div className="grid grid-cols-1 mb-5 gap-5">
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							rows={5}
							placeholder="Venue description"
							{...register('description', { required: true })}
						/>
						{errors.description?.message && (
							<ErrorMessage>{errors.description?.message}</ErrorMessage>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Create Venue
				</Button>
			</div>
		</form>
	);
};
