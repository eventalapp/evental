import React, { useState } from 'react';

import { useSignOutMutation } from '../../../hooks/mutations/useSignOutMutation';
import { useEventQuery } from '../../../hooks/queries/useEventQuery';
import { useRolesQuery } from '../../../hooks/queries/useRolesQuery';
import { useUser } from '../../../hooks/queries/useUser';
import { SettingsAuthenticated } from './Authenticated';

type Props = {
	eid: string;
};

export const EventSettingsNavigation: React.FC<Props> = (props) => {
	const { eid, ...restProps } = props;
	const { user } = useUser();
	const { event } = useEventQuery(eid);
	const { roles } = useRolesQuery(eid);
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();

	if (user && roles && event) {
		return (
			<SettingsAuthenticated
				event={event}
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
