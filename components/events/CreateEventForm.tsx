import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UseCreateEventMutationData } from '../../hooks/mutations/useCreateEventMutation';
import { CreateEventPayload, CreateEventSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { DatePicker } from '../form/DatePicker';
import { useRouter } from 'next/router';

type Props = { canCancel?: boolean } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseCreateEventMutationData;

export const CreateEventForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { createEventMutation, canCancel = false } = props;
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { errors }
	} = useForm<CreateEventPayload>({
		defaultValues: {
			startDate: new Date(),
			endDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3)
		},
		resolver: zodResolver(CreateEventSchema)
	});

	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

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

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createEventMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input placeholder="Event name" {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 mb-5 gap-5">
						<div>
							<Label htmlFor="startDate">Start Date *</Label>
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
											required
											selectsStart
											dateFormat="MM/dd/yyyy"
										/>
									)}
								/>
							</div>
							{errors.startDate?.message && (
								<ErrorMessage>{errors.startDate?.message}</ErrorMessage>
							)}
						</div>

						<div>
							<Label htmlFor="endDate">End Date *</Label>
							<div className="relative">
								<Controller
									control={control}
									name="endDate"
									render={({ field }) => (
										<DatePicker
											onChange={(e) => field.onChange(e)}
											selected={field.value}
											selectsEnd
											required
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
			</div>

			<div className="flex flex-row justify-end">
				{canCancel && (
					<Button type="button" variant="no-bg" onClick={router.back}>
						Cancel
					</Button>
				)}
				<Button type="submit" className="ml-4" variant="primary" padding="large">
					Create Event
				</Button>
			</div>
		</form>
	);
};
