import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateAttendeePayload, CreateAttendeeSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseEventQueryData } from '../../hooks/queries/useEventQuery';
import { useAttendeeQuery } from '../../hooks/queries/useAttendeeQuery';
import { slugify } from '../../utils/slugify';
import { UseCreateAttendeeMutationData } from '../../hooks/mutations/useCreateAttendeeMutation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseEventQueryData &
	UseCreateAttendeeMutationData;

export const CreateAttendeeForm: React.FC<Props> = (props) => {
	const { createAttendeeMutation, event } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		formState: { errors }
	} = useForm<CreateAttendeePayload>({
		resolver: zodResolver(CreateAttendeeSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');

	const { attendee, isAttendeeLoading } = useAttendeeQuery(String(event?.id), slugWatcher);

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
				createAttendeeMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Full Name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Location" {...register('location', { required: true })} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
					</div>
				</div>
			</div>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="position">Position</Label>
						<Input placeholder="Position" {...register('position', { required: true })} />
						{errors.position?.message && <ErrorMessage>{errors.position?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="company">Company</Label>
						<Input placeholder="Company" {...register('company', { required: true })} />
						{errors.company?.message && <ErrorMessage>{errors.company?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						rows={5}
						placeholder="Event description"
						{...register('description', { required: true })}
					/>
					{errors.description?.message && (
						<ErrorMessage>{errors.description?.message}</ErrorMessage>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
				<div>
					<div>
						<Label htmlFor="slug">Slug</Label>
						<div className="flex items-center">
							<span className="mr-1 text-md">/attendees/</span>
							<Input placeholder="attendee-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{attendee && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>

				<div>
					<Label htmlFor="image">Image</Label>
					<Input
						type="file"
						accept="image/png, image/jpeg"
						{...register('image', { required: true })}
					/>
					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					disabled={isAttendeeLoading || Boolean(attendee)}
				>
					Register
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
				</Button>
			</div>
		</form>
	);
};
