import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

import { UseSignInMutationData } from '../../hooks/mutations/useSignInMutation';
import { SignInPayload, SignInSchema } from '../../utils/schemas';
import { LoadingInner } from '../error/LoadingInner';
import { ErrorMessage } from '../form/ErrorMessage';
import { Button } from '../primitives/Button';
import { Input } from '../primitives/Input';
import { Label } from '../primitives/Label';

type Props = { params?: string } & DetailedHTMLProps<
	FormHTMLAttributes<HTMLFormElement>,
	HTMLFormElement
> &
	UseSignInMutationData;

export const SignInForm: React.FC<Props> = (props) => {
	const { signInMutation, params } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignInPayload>({
		resolver: zodResolver(SignInSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				signInMutation.mutate(data);
			})}
		>
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
				<div className="mt-3 flex flex-row justify-between">
					<span className="block" />

					<span className="block">
						<Link href="/auth/password/request">
							<a className="text-sm text-primary">Forgot Password?</a>
						</Link>
					</span>
				</div>
			</div>

			<div className="mt-5 flex flex-row justify-center">
				<Button
					type="submit"
					className="w-full"
					variant="primary"
					padding="medium"
					disabled={signInMutation.isLoading}
				>
					{signInMutation.isLoading ? <LoadingInner /> : 'Sign In'}
				</Button>
			</div>
			<span className="mt-3 block">
				Dont have an account?{' '}
				<Link href={`/auth/signup?${params}`}>
					<a className="text-sm text-primary">Sign up</a>
				</Link>
			</span>
		</form>
	);
};
