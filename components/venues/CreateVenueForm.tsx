import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseCreateVenueMutationData } from '../../hooks/mutations/useCreateVenueMutation';
import { useForm } from 'react-hook-form';
import { CreateVenuePayload, CreateVenueSchema } from '../../utils/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { slugify } from '../../utils/slugify';
import { ErrorMessage } from '../form/ErrorMessage';
import { useVenueQuery } from '../../hooks/queries/useVenueQuery';
import { useRouter } from 'next/router';

type Props = { eid: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateVenueMutationData;

export const CreateVenueForm: React.FC<Props> = (props) => {
	const router = useRouter();

	const { createVenueMutation, eid } = props;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<CreateVenuePayload>({
		resolver: zodResolver(CreateVenueSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { venue: venueSlugCheck, isVenueLoading: isVenueSlugCheckLoading } = useVenueQuery(
		String(eid),
		slugWatcher
	);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

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

					<div>
						<Label htmlFor="slug">Slug</Label>
						<Input placeholder="venue-slug" {...register('slug', { required: true })} />
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{venueSlugCheck && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
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
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={isVenueSlugCheckLoading || Boolean(venueSlugCheck)}
				>
					Create Venue
				</Button>
			</div>
		</form>
	);
};
