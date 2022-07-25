import { zodResolver } from '@hookform/resolvers/zod';
import { endOfDay, startOfDay } from 'date-fns';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useForm } from 'react-hook-form';

import { CreateEventPayload, CreateEventSchema, formatDateRange } from '@eventalapp/shared/utils';

import { UseCreateEventMutationData } from '../../hooks/mutations/useCreateEvent';
import { LoadingInner } from '../error/LoadingInner';
import { renderCustomHeader } from '../form/DatePicker';
import { DatePickerButton } from '../form/DatePickerButton';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

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
		formState: { errors }
	} = useForm<CreateEventPayload>({
		defaultValues: {
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			startDate: startOfDay(new Date()),
			endDate: endOfDay(new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3))
		},
		resolver: zodResolver(CreateEventSchema)
	});

	const startDateWatcher = watch('startDate');
	const endDateWatcher = watch('endDate');

	return (
		<form
			onSubmit={handleSubmit((data) => {
				createEventMutation.mutate(data);
			})}
		>
			<div className="my-5 flex w-full flex-col">
				<div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
					<div className="col-span-1 lg:col-span-2">
						<Label htmlFor="name">Name *</Label>
						<Input placeholder={`Event Name ${new Date().getFullYear()}`} {...register('name')} />
						{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
					</div>

					<div className="col-span-1">
						<Label>Date *</Label>
						<div className="relative">
							<ReactDatePicker
								selected={startDateWatcher}
								onChange={(dates: any) => {
									const [start, end] = dates;

									setValue('startDate', start);

									setValue('endDate', end);
								}}
								startDate={startDateWatcher}
								endDate={endDateWatcher}
								selectsRange
								minDate={new Date()}
								required
								popperPlacement="bottom"
								placeholderText="Select date"
								nextMonthButtonLabel=">"
								previousMonthButtonLabel="<"
								popperClassName="react-datepicker-right"
								customInput={
									<DatePickerButton>
										{startDateWatcher && endDateWatcher
											? formatDateRange(startDateWatcher, endDateWatcher, { showHour: false })
											: 'Select date'}
									</DatePickerButton>
								}
								renderCustomHeader={renderCustomHeader}
							/>
						</div>
						{errors.startDate?.message && <ErrorMessage>{errors.startDate?.message}</ErrorMessage>}
						{errors.endDate?.message && <ErrorMessage>{errors.endDate?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				{canCancel && (
					<Button type="button" variant="no-bg" onClick={router.back}>
						Cancel
					</Button>
				)}
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="large"
					disabled={createEventMutation.isLoading}
				>
					{createEventMutation.isLoading ? <LoadingInner /> : 'Create'}
				</Button>
			</div>
		</form>
	);
};
