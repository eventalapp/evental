import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useRequestPasswordReset } from '@eventalapp/shared/hooks';
import {
	ChangePasswordRequestPayload,
	ChangePasswordRequestSchema
} from '@eventalapp/shared/utils';

import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const RequestPasswordResetForm: React.FC<Props> = () => {
	const router = useRouter();
	const { mutate: requestPasswordReset, isLoading: isRequestPasswordResetLoading } =
		useRequestPasswordReset({
			onSuccess: () => {
				toast.success('Password reset request successfully sent. Check your email.');
			},
			onError: (error) => {
				toast.error(error?.message ?? 'An error has occurred.');
			}
		});
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
				requestPasswordReset(data);
			})}
		>
			<div className="my-5">
				<div>
					<Label htmlFor="name">Email *</Label>
					<Input placeholder="Email" type="email" {...register('email')} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
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
					disabled={isRequestPasswordResetLoading}
				>
					{isRequestPasswordResetLoading ? <LoadingInner /> : 'Request'}
				</Button>
			</div>
		</form>
	);
};
