import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useResetPassword } from '@eventalapp/shared/hooks';
import { ChangePasswordPayload, ChangePasswordSchema } from '@eventalapp/shared/utils';

import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = { code: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
>;
export const PasswordResetForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { code } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<ChangePasswordPayload>({
		defaultValues: {
			code
		},
		resolver: zodResolver(ChangePasswordSchema)
	});
	const { mutate: passwordReset, isLoading: isPasswordResetLoading } = useResetPassword({
		onSuccess: () => {
			toast.success('Password reset request successfully sent. Check your email.');
		},
		onError: (error) => {
			toast.error(error?.message ?? 'An error has occurred.');
		}
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				passwordReset(data);
			})}
		>
			<div className="my-5 flex w-full flex-col">
				<div>
					<Label htmlFor="name">New Password *</Label>
					<Input type="password" placeholder="Password" {...register('password')} />
					{errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
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
					disabled={isPasswordResetLoading}
				>
					{isPasswordResetLoading ? <LoadingInner /> : 'Change'}
				</Button>
			</div>
		</form>
	);
};
