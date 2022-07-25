import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useSignUp } from '@eventalapp/shared/hooks';
import { SignUpPayload, SignUpSchema } from '@eventalapp/shared/utils';

import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export const SignUpForm: React.FC<Props> = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpPayload>({
		resolver: zodResolver(SignUpSchema)
	});
	const { mutate: signUp, isLoading: isSignUpLoading } = useSignUp({
		onSuccess: () => {
			const redirectUrl = router.query.redirectUrl ? String(router.query.redirectUrl) : undefined;

			if (!redirectUrl) {
				router.push('/events').then(() => {
					toast.success('You have successfully signed up');
				});
			} else {
				router.push(redirectUrl).then(() => {
					toast.success('You have successfully signed up');
				});
			}
		},
		onError: (error) => {
			toast.error(error?.message ?? 'Failed to sign up.');
		}
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				signUp(data);
			})}
		>
			<div className="mt-5 w-full">
				<div>
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Name" {...register('name')} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="mt-5 w-full">
				<div>
					<Label htmlFor="email">Email *</Label>
					<Input placeholder="Email" {...register('email')} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="mt-5 w-full">
				<div>
					<Label htmlFor="password">Password *</Label>
					<Input type="password" placeholder="Password" {...register('password')} />
					{errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="mt-8">
				<Button
					type="submit"
					className="w-full"
					variant="primary"
					padding="medium"
					disabled={isSignUpLoading}
				>
					{isSignUpLoading ? <LoadingInner /> : 'Sign Up'}
				</Button>
			</div>
		</form>
	);
};
