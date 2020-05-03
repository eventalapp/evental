import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ChangePasswordPayload, ChangePasswordSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { UsePasswordResetData } from '../../hooks/mutations/usePasswordReset';
import { LoadingInner } from '../error/LoadingInner';

type Props = { code: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UsePasswordResetData;

export const PasswordResetForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { passwordResetMutation, code } = props;
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

	return (
		<form
			onSubmit={handleSubmit((data) => {
				passwordResetMutation.mutate(data);
			})}
		>
			<div className="flex flex-col w-full my-5">
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
					disabled={passwordResetMutation.isLoading}
				>
					{passwordResetMutation.isLoading ? <LoadingInner /> : 'Change Password'}
				</Button>
			</div>
		</form>
	);
};
