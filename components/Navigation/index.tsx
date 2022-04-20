import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

interface NavigationProps {
	className?: string;
}

export const Navigation: React.FC<NavigationProps> = (props) => {
	const { className, ...restProps } = props;

	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);

	if (session) {
		return <Authenticated isOpen={isOpen} setIsOpen={setIsOpen} session={session} {...restProps} />;
	}

	return <Unauthenticated isOpen={isOpen} setIsOpen={setIsOpen} {...restProps} />;
};
