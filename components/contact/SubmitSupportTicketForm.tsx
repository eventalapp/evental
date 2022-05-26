import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useSubmitSupportTicketMutation } from '../../hooks/mutations/useSubmitSupportTicketMutation';
import { SubmitSupportTicketPayload, SubmitSupportTicketSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { StyledEditor } from '../form/Editor';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import Select, { Option } from '../radix/components/Select';

const attendanceTypes: Option[] = [
	{ value: 'attending', label: 'Attending' },
	{ value: 'organizing', label: 'Organizing' },
	{ value: 'speaker', label: 'Speaking, Exhibiting or other' }
];

const helpTypes: Option[] = [
	{ value: 'bug', label: 'Bug Report' },
	{ value: 'sales', label: 'Sales Question' },
	{ value: 'billing', label: 'Billing Questions' },
	{ value: 'account', label: 'Account Issue' },
	{ value: 'feature', label: 'Feature Request' },
	{ value: 'question', label: 'General Questions' },
	{ value: 'other', label: 'Other' }
];

export const SubmitSupportTicketForm = () => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors }
	} = useForm<SubmitSupportTicketPayload>({
		defaultValues: {
			helpType: helpTypes[0].value,
			attendanceType: attendanceTypes[0].value
		},
		resolver: zodResolver(SubmitSupportTicketSchema)
	});

	const submitSupportTicketMutation = useSubmitSupportTicketMutation({ redirectUrl: '/' });

	return (
		<form
			onSubmit={handleSubmit((data) => {
				submitSupportTicketMutation.mutate(data);
			})}
		>
			<div className="space-y-5">
				<div>
					<Label htmlFor="attendanceType">Are you organizing or attending an event? *</Label>

					<Controller
						control={control}
						name="attendanceType"
						render={({ field }) => (
							<Select
								options={attendanceTypes}
								value={field.value}
								onValueChange={(value) => {
									setValue('attendanceType', value);
								}}
							/>
						)}
					/>

					{errors.attendanceType?.message && (
						<ErrorMessage>{errors.attendanceType?.message}</ErrorMessage>
					)}
				</div>

				<div>
					<Label htmlFor="helpType">What do you need help with? *</Label>

					<Controller
						control={control}
						name="helpType"
						render={({ field }) => (
							<Select
								options={helpTypes}
								value={field.value}
								onValueChange={(value) => {
									setValue('helpType', value);
								}}
							/>
						)}
					/>

					{errors.attendanceType?.message && (
						<ErrorMessage>{errors.attendanceType?.message}</ErrorMessage>
					)}
				</div>

				<div>
					<Label htmlFor="body">What's your question, comment, or problem? *</Label>
					<Controller
						control={control}
						name="body"
						render={({ field }) => (
							<StyledEditor
								onChange={(value) => {
									field.onChange(value);
								}}
								content={field.value || ''}
							/>
						)}
					/>
					{errors.body?.message && <ErrorMessage>{errors.body?.message}</ErrorMessage>}
				</div>

				<div>
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="John Doe" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>

				<div>
					<Label htmlFor="email">Email *</Label>
					<Input placeholder="johndoe@email.com" {...register('email')} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>

				<div>
					<Label htmlFor="website">Website</Label>
					<Input placeholder="evental.app/events/your-event" {...register('website')} />
					{errors.website?.message && <ErrorMessage>{errors.website?.message}</ErrorMessage>}
				</div>

				<div>
					<Label htmlFor="phoneNumber">Phone Number</Label>
					<Input placeholder="(123)-123-1234" {...register('phoneNumber')} />
					{errors.phoneNumber?.message && (
						<ErrorMessage>{errors.phoneNumber?.message}</ErrorMessage>
					)}
				</div>

				<div className="flex flex-row justify-end">
					<Button
						type="submit"
						variant="primary"
						className="ml-4"
						padding="medium"
						disabled={submitSupportTicketMutation.isLoading}
					>
						{submitSupportTicketMutation.isLoading ? <LoadingInner /> : 'Submit Ticket'}
					</Button>
				</div>
			</div>
		</form>
	);
};
