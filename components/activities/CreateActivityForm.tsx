import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { UseVenuesQueryData } from '../../hooks/queries/useVenuesQuery';
import { UseCreateActivityMutationData } from '../../hooks/mutations/useCreateActivityMutation';
import { Loading } from '../Loading';
import { ViewServerError } from '../ViewServerError';
import { NotFound } from '../NotFound';
import { ErrorMessage } from '../form/ErrorMessage';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../form/DatePicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CreateActivityPayload, CreateActivitySchema } from '../../utils/schemas';
import { toast } from 'react-toastify';
import { slugify } from '../../utils/slugify';
import Link from 'next/link';
import { Select } from '../form/Select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActivityQuery } from '../../hooks/queries/useActivityQuery';

type Props = {
	eid: string;
};

type CreateActivityFormProps = Props &
	DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseVenuesQueryData &
	UseCreateActivityMutationData;

export const CreateActivityForm: React.FC<CreateActivityFormProps> = (props) => {
	const { eid, isVenuesLoading, venuesError, venues, createActivityError, createActivityMutation } =
		props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,
		control,
		formState: { errors }
	} = useForm<CreateActivityPayload>({
		defaultValues: {
			venueId: venues && venues[0]?.id,
			startDate: new Date(),
			endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3)
		},
		resolver: zodResolver(CreateActivitySchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	const { activity, isActivityLoading } = useActivityQuery(String(eid), slugWatcher);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('endDate', startDateWatcher);
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('startDate', endDateWatcher);
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	useEffect(() => {
		setValue('slug', slugify(nameWatcher));

		if (errors.name) {
			void trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue('slug', slugify(slugWatcher));
	}, [slugWatcher]);

	useEffect(() => {
		createActivityError && toast.error(createActivityError.message);
	}, [createActivityError, venuesError]);

	if (isVenuesLoading) {
		return <Loading />;
	}

	if (venuesError) {
		return <ViewServerError errors={[venuesError]} />;
	}

	if (!venues) {
		return <NotFound />;
	}

	if (venues && venues.length === 0) {
		return (
			<div>
				<Link href={`/events/${eid}/admin/venues/create`}>
					<a className="text-red-600">Before creating an activity, you must create a venue.</a>
				</Link>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createActivityMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Activity name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="venueId">Venue</Label>
						<Select
							defaultValue={venues && venues[0].id}
							{...register('venueId', { required: true })}
						>
							{venues.map((venue) => (
								<option key={venue.id} value={venue.id}>
									{venue.name}
								</option>
							))}
						</Select>

						<Link href={`/events/${eid}/admin/venues/create`}>
							<a className="text-gray-600 text-sm mt-1">Dont see your venue? Create a Venue</a>
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="startDate">Start Date</Label>
						<div className="relative">
							<Controller
								control={control}
								name="startDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										startDate={field.value}
										endDate={endDateWatcher}
										selectsStart
										dateFormat="MM/dd/yyyy"
									/>
								)}
							/>
						</div>
						{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="endDate">End Date</Label>
						<div className="relative">
							<Controller
								control={control}
								name="endDate"
								render={({ field }) => (
									<DatePicker
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										selectsEnd
										startDate={startDateWatcher}
										endDate={field.value}
										dateFormat="MM/dd/yyyy"
									/>
								)}
							/>
						</div>
						{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						rows={5}
						placeholder="Activity description"
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
							<span className="mr-1 text-md">/activities/</span>
							<Input placeholder="activity-slug" {...register('slug', { required: true })} />
						</div>
						{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
						{activity && (
							<ErrorMessage>This slug is already taken, please choose another</ErrorMessage>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button
					type="submit"
					variant="primary"
					padding="medium"
					disabled={isActivityLoading || Boolean(activity)}
				>
					Register Activity
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faChevronRight} />
				</Button>
			</div>
		</form>
	);
};
