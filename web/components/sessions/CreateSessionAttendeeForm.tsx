import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useUser } from '@eventalapp/shared/hooks';

import { useCreateSessionAttendee } from '../../hooks/mutations/useCreateSessionAttendee';
import { LoadingInner } from '../error/LoadingInner';
import { Button } from '../primitives/Button';

type Props = { eid: string; sid: string };

export const CreateSessionAttendeeForm: React.FC<Props> = (props) => {
	const { eid, sid } = props;
	const router = useRouter();
	const { handleSubmit } = useForm();
	const { data: user } = useUser();
	const { createSessionAttendeeMutation } = useCreateSessionAttendee(eid, sid, user?.id, {
		redirectUrl: `/events/${eid}/sessions/${sid}`
	});

	return (
		<form
			onSubmit={handleSubmit(() => {
				createSessionAttendeeMutation.mutate();
			})}
		>
			<div className="mt-3 flex flex-row justify-end">
				<Button type="button" variant="no-bg" onClick={router.back}>
					Cancel
				</Button>
				<Button
					type="submit"
					className="ml-4"
					variant="primary"
					padding="medium"
					disabled={createSessionAttendeeMutation.isLoading}
				>
					{createSessionAttendeeMutation.isLoading ? <LoadingInner /> : 'Register'}
				</Button>
			</div>
		</form>
	);
};
