import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useSubmitDemoRequestMutation } from '../../hooks/mutations/useSubmitDemoRequestMutation';
import { SubmitDemoRequestPayload, SubmitDemoRequestSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { Textarea } from '../form/Textarea';

export const SubmitDemoRequestForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SubmitDemoRequestPayload>({
		resolver: zodResolver(SubmitDemoRequestSchema)
	});

	const submitDemoRequestMutation = useSubmitDemoRequestMutation({ redirectUrl: '/' });

	return (
		<form
			onSubmit={handleSubmit((data) => {
				submitDemoRequestMutation.mutate(data);
			})}
			className="w-full"
		>
			<div className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Label htmlFor="organizationName">Organization *</Label>
						<Input placeholder="Organization Name" {...register('organizationName')} />
						{errors.organizationName?.message && (
							<ErrorMessage>{errors.organizationName?.message}</ErrorMessage>
						)}
					</div>

					<div>
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input placeholder="(123)-123-1234" {...register('phoneNumber')} />
						{errors.phoneNumber?.message && (
							<ErrorMessage>{errors.phoneNumber?.message}</ErrorMessage>
						)}
					</div>
				</div>

				<div>
					<Label htmlFor="body">How can we help you? *</Label>
					<Textarea className="min-h-[100px]" {...register('body')} />
					{errors.body?.message && <ErrorMessage>{errors.body?.message}</ErrorMessage>}
				</div>

				<div className="flex flex-row justify-end">
					<Button
						type="submit"
						variant="primary"
						className="ml-4"
						padding="medium"
						disabled={submitDemoRequestMutation.isLoading}
					>
						{submitDemoRequestMutation.isLoading ? <LoadingInner /> : 'Submit Demo Request'}
					</Button>
				</div>
			</div>
		</form>
	);
};
