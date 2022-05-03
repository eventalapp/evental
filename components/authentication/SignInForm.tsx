import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { SignInPayload, SignInSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseSignInMutationData } from '../../hooks/mutations/useSignInMutation';
import Link from 'next/link';
import { LoadingInner } from '../error/LoadingInner';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseSignInMutationData;

export const SignInForm: React.FC<Props> = (props) => {
	const { signInMutation } = props;
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
			<div className="w-full mt-5">
				<div>
					<Label htmlFor="email">Email *</Label>
					<Input placeholder="Email" {...register('email')} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="w-full mt-5">
				<div>
					<Label htmlFor="password">Password *</Label>
					<Input type="password" placeholder="Password" {...register('password')} />
					{errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
				</div>
				<div className="flex flex-row justify-between mt-3">
					<span className="block" />

					<span className="block">
						<Link href="/auth/password/request">
							<a className="text-primary text-sm">Forgot Password?</a>
						</Link>
					</span>
				</div>
			</div>

			<div className="flex flex-row justify-center mt-5">
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
				<Link href="/auth/signup">
					<a className="text-primary text-sm">Sign up</a>
				</Link>
			</span>
		</form>
	);
};
