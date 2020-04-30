import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { SignInPayload, SignInSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseSignInMutationData } from '../../hooks/mutations/useSignInMutation';

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
			<div className="flex flex-col w-full mt-5">
				<div className="grid grid-cols-1 md:grid-cols-2 mb-5 gap-5">
					<div>
						<Label htmlFor="email">Email *</Label>
						<Input placeholder="Email" {...register('email', { required: true })} />
						{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
					</div>

					<div>
						<Label htmlFor="password">Password *</Label>
						<Input placeholder="Password" {...register('password', { required: true })} />
						{errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
					</div>
				</div>
			</div>

			<div className="flex flex-row justify-end">
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Sign In
				</Button>
			</div>
		</form>
	);
};
