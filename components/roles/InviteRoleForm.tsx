import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { InviteRolePayload, InviteRoleSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingInner } from '../error/LoadingInner';
import { UseInviteRoleData } from '../../hooks/mutations/useInviteRoleMutation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseInviteRoleData;

export const InviteRoleForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { inviteRoleMutation } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteRolePayload>({
		resolver: zodResolver(InviteRoleSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				inviteRoleMutation.mutate(data);
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
					disabled={inviteRoleMutation.isLoading}
				>
					{inviteRoleMutation.isLoading ? <LoadingInner /> : 'Invite Role'}
				</Button>
			</div>
		</form>
	);
};
