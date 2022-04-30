import React, { useState } from 'react';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';
import { useSignOutMutation } from '../../hooks/mutations/useSignOutMutation';
import { useUser } from '../../hooks/queries/useUser';

type Props = {
	className?: string;
};

export const Navigation: React.FC<Props> = (props) => {
	const { className, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();
	const { user } = useUser();

	if (user) {
		return (
			<Authenticated
				signOutMutation={signOutMutation}
				user={user}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				{...restProps}
			/>
		);
	}

	return <Unauthenticated isOpen={isOpen} setIsOpen={setIsOpen} {...restProps} />;
};
