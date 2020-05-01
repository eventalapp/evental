import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ChangePasswordRequestPayload, ChangePasswordRequestSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseRequestPasswordResetData } from '../../hooks/mutations/useRequestPasswordReset';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseRequestPasswordResetData;

export const RequestPasswordResetForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { requestPasswordResetMutation } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ChangePasswordRequestPayload>({
		resolver: zodResolver(ChangePasswordRequestSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				requestPasswordResetMutation.mutate(data);
			})}
		>
			<div className="my-5">
				<div>
					<Label htmlFor="name">Email *</Label>
					<Input placeholder="Email" {...register('email', { required: true })} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Request Password Reset
				</Button>
			</div>
		</form>
	);
};
