import React, { useState } from 'react';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';
import { useSignOutMutation } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import Prisma from '@prisma/client';

type Props = {
	event: Prisma.Event | undefined;
	roles: Prisma.EventRole[] | undefined;
	user: PasswordlessUser | undefined;
};

export const EventNavigation: React.FC<Props> = (props) => {
	const { roles, event, user, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();

	if (user) {
		if (roles && event) {
			return (
				<Authenticated
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
	}

	return <Unauthenticated isOpen={isOpen} setIsOpen={setIsOpen} {...restProps} />;
};
