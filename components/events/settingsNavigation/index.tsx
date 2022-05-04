import React, { useState } from 'react';
import { SettingsAuthenticated } from './Authenticated';
import { useSignOutMutation } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import Prisma from '@prisma/client';

type Props = {
	event: Prisma.Event | undefined;
	roles: Prisma.EventRole[] | undefined;
	user: PasswordlessUser | undefined;
};

export const EventSettingsNavigation: React.FC<Props> = (props) => {
	const { roles, event, user, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();

	if (user && roles && event) {
		return (
			<SettingsAuthenticated
				event={event}
				roles={roles}
				signOutMutation={signOutMutation}
				user={user}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				{...restProps}
			/>
		);
	}

	return null;
};
