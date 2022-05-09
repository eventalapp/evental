import React, { DetailedHTMLProps, FormHTMLAttributes } from 'react';
import { Button } from '../form/Button';
import { Input } from '../form/Input';
import { Label } from '../form/Label';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { InviteOrganizerPayload, InviteOrganizerSchema } from '../../utils/schemas';
import { ErrorMessage } from '../form/ErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoadingInner } from '../error/LoadingInner';
import { UseInviteOrganizerData } from '../../hooks/mutations/useInviteOrganizerMutation';

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> &
	UseInviteOrganizerData;

export const InviteOrganizerForm: React.FC<Props> = (props) => {
	const router = useRouter();
	const { inviteOrganizerMutation } = props;
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<InviteOrganizerPayload>({
		resolver: zodResolver(InviteOrganizerSchema)
	});

	return (
		<form
			onSubmit={handleSubmit((data) => {
				inviteOrganizerMutation.mutate(data);
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
					disabled={inviteOrganizerMutation.isLoading}
				>
					{inviteOrganizerMutation.isLoading ? <LoadingInner /> : 'Invite Organizer'}
				</Button>
			</div>
		</form>
	);
};
