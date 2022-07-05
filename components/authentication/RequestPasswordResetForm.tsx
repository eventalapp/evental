import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import { UseRequestPasswordResetData } from '../../hooks/mutations/useRequestPasswordReset';
import { ChangePasswordRequestPayload, ChangePasswordRequestSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

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
					disabled={requestPasswordResetMutation.isLoading}
				>
					{requestPasswordResetMutation.isLoading ? <LoadingInner /> : 'Request Password Reset'}
				</Button>
			</div>
		</form>
	);
};
