import { faCalendarPlus, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { DetailedHTMLProps, FormHTMLAttributes, forwardRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UseCreateEventMutationData } from '../../hooks/mutations/useCreateEventMutation';
import { CreateEventSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';
import { ServerError } from '../ServerError';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseCreateEventMutationData;

export type CreateEventFormValues = {
	name: string;
	description: string;
	location: string;
	slug: string;
	image: FileList;
	startDate: Date;
	endDate: Date;
};

export const CreateEventForm: React.FC<Props> = (props) => {
	const { createEventMutation, createEventError } = props;

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		trigger,

		clearErrors,
		control,
		formState: { errors }
	} = useForm<CreateEventFormValues>({
		defaultValues: {
			startDate: new Date(),
			endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3)
		},
		resolver: zodResolver(CreateEventSchema)
	});

	const nameWatcher = watch('name');
	const slugWatcher = watch('slug');
	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('startDate', endDateWatcher);
			toast.warn('The start date cannot be later than the end date.');
		}
	}, [startDateWatcher]);

	useEffect(() => {
		if (startDateWatcher.getTime() > endDateWatcher.getTime()) {
			setValue('endDate', startDateWatcher);
			toast.warn('The end date cannot be earlier than the start date.');
		}
	}, [endDateWatcher]);

	useEffect(() => {
		setValue(
			'slug',
			nameWatcher
				?.trim()
				.replace(/[\])}[{(]/g, '')
				.replace(/\s+/g, '-')
				.toLowerCase()
		);

		if (errors.name) {
			trigger('slug');
		}
	}, [nameWatcher]);

	useEffect(() => {
		setValue(
			'slug',
			slugWatcher
				?.replace(/[\])}[{(]/g, '')
				.replace(/\s+/g, '-')
				.toLowerCase()
		);
	}, [slugWatcher]);

	if (createEventError) {
		return <ServerError errors={[createEventError]} />;
	}

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createEventMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="name">Name</Label>
						<Input placeholder="Event name" {...register('name', { required: true })} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input placeholder="Event location" {...register('location', { required: true })} />
						{errors.location?.message && <ErrorMessage>{errors.location?.message}</ErrorMessage>}
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
										className="input"
										placeholderText="Select date"
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										selectsStart
										nextMonthButtonLabel=">"
										previousMonthButtonLabel="<"
										popperClassName="react-datepicker-right"
										customInput={<ButtonInput />}
										startDate={field.value}
										endDate={endDateWatcher}
										renderCustomHeader={({
											date,
											decreaseMonth,
											increaseMonth,
											prevMonthButtonDisabled,
											nextMonthButtonDisabled
										}) => (
											<div className="flex items-center justify-between px-2 py-2">
												<span className="text-lg text-gray-700 font-bold">
													{format(date, 'MMMM yyyy')}
												</span>

												<div className="space-x-2">
													<button
														onClick={decreaseMonth}
														disabled={prevMonthButtonDisabled}
														type="button"
														className={classNames(
															prevMonthButtonDisabled && 'cursor-not-allowed opacity-50',
															'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
														)}
													>
														<FontAwesomeIcon
															fill="currentColor"
															className="w-5 h-5 text-gray-600"
															size="1x"
															icon={faChevronLeft}
														/>
													</button>

													<button
														onClick={increaseMonth}
														disabled={nextMonthButtonDisabled}
														type="button"
														className={classNames(
															nextMonthButtonDisabled && 'cursor-not-allowed opacity-50',
															'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
														)}
													>
														<FontAwesomeIcon
															fill="currentColor"
															className="w-5 h-5 text-gray-600"
															size="1x"
															icon={faChevronRight}
														/>
													</button>
												</div>
											</div>
										)}
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
										className="input"
										placeholderText="Select date"
										onChange={(e) => field.onChange(e)}
										selected={field.value}
										selectsEnd
										nextMonthButtonLabel=">"
										previousMonthButtonLabel="<"
										popperClassName="react-datepicker-right"
										customInput={<ButtonInput />}
										startDate={startDateWatcher}
										endDate={field.value}
										renderCustomHeader={({
											date,
											decreaseMonth,
											increaseMonth,
											prevMonthButtonDisabled,
											nextMonthButtonDisabled
										}) => (
											<div className="flex items-center justify-between px-2 py-2">
												<span className="text-lg text-gray-700 font-bold">
													{format(date, 'MMMM yyyy')}
												</span>

												<div className="space-x-2">
													<button
														onClick={decreaseMonth}
														disabled={prevMonthButtonDisabled}
														type="button"
														className={classNames(
															prevMonthButtonDisabled && 'cursor-not-allowed opacity-50',
															'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
														)}
													>
														<FontAwesomeIcon
															fill="currentColor"
															className="w-5 h-5 text-gray-900"
															size="1x"
															icon={faChevronLeft}
														/>
													</button>

													<button
														onClick={increaseMonth}
														disabled={nextMonthButtonDisabled}
														type="button"
														className={classNames(
															nextMonthButtonDisabled && 'cursor-not-allowed opacity-50',
															'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
														)}
													>
														<FontAwesomeIcon
															fill="currentColor"
															className="w-5 h-5 text-gray-900"
															size="1x"
															icon={faChevronRight}
														/>
													</button>
												</div>
											</div>
										)}
									/>
								)}
							/>
						</div>
						{errors.endDate?.message && (
							<span className="text-red-500 mt-2">{errors.endDate?.message}</span>
						)}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 mb-5 gap-5">
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
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
					<Label htmlFor="slug">Slug</Label>
					<Input placeholder="event-slug" {...register('slug', { required: true })} />
					{errors.slug?.message && <ErrorMessage>{errors.slug?.message}</ErrorMessage>}
				</div>

				<div>
					<Label htmlFor="image">Image</Label>
					<Input type="file" {...register('image', { required: true })} />
					{errors.image?.message && <ErrorMessage>{errors.image?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="submit" variant="gradient" padding="medium">
					Register Event
					<FontAwesomeIcon fill="currentColor" className="ml-2" size="1x" icon={faCalendarPlus} />
				</Button>
			</div>
		</form>
	);
};

const ButtonInput = forwardRef<HTMLButtonElement, { value?: Date; onClick?: () => void }>(
	({ value, onClick }, ref) => (
		<button
			onClick={onClick}
			ref={ref}
			type="button"
			className="inline-flex justify-start w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary"
		>
			{value && format(new Date(value), 'dd MMMM yyyy')}
		</button>
	)
);
