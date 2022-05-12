import React, { useState } from 'react';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';
import { useSignOutMutation } from '../../../hooks/mutations/useSignOutMutation';
import { PasswordlessUser } from '../../../utils/stripUserPassword';
import Prisma from '@prisma/client';

type Props = {
	event: Prisma.Event | undefined;
	roles: Prisma.EventRole[] | undefined;
	pages: Prisma.EventPage[] | undefined;
	user: PasswordlessUser | undefined;
};

export const EventNavigation: React.FC<Props> = (props) => {
	const { roles, event, user, pages, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();

	if (user && roles && event && pages) {
		return (
			<Authenticated
				pages={pages}
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

	if (event && roles && pages) {
		return (
			<Unauthenticated
				pages={pages}
				event={event}
				roles={roles}
				signOutMutation={signOutMutation}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				{...restProps}
			/>
		);
	}

	return null;
};
