import { zodResolver } from '@hookform/resolvers/zod';
import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { SignUpPayload, SignUpSchema } from '../../utils/schemas';
import { Button } from '../form/Button';
import { ErrorMessage } from '../form/ErrorMessage';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { UseSignUpMutationData } from '../../hooks/mutations/useSignUpMutation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseSignUpMutationData;

export const SignUpForm: React.FC<Props> = (props) => {
	const { signUpMutation } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<SignUpPayload>({
		resolver: zodResolver(SignUpSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				signUpMutation.mutate(data);
			})}
		>
			<div className="w-full mt-5">
				<div>
					<Label htmlFor="name">Name *</Label>
					<Input placeholder="Name" {...register('name', { required: true })} />
					{errors.name?.message && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="w-full mt-5">
				<div>
					<Label htmlFor="email">Email *</Label>
					<Input placeholder="Email" {...register('email', { required: true })} />
					{errors.email?.message && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="w-full mt-5">
				<div>
					<Label htmlFor="password">Password *</Label>
					<Input
						type="password"
						placeholder="Password"
						{...register('password', { required: true })}
					/>
					{errors.password?.message && <ErrorMessage>{errors.password?.message}</ErrorMessage>}
				</div>
			</div>

			<div className="flex flex-row justify-end mt-5">
				<Button type="submit" className="ml-4" variant="primary" padding="medium">
					Sign Up
				</Button>
			</div>
		</form>
	);
};