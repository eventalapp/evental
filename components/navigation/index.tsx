import Link from 'next/link';
import React, { useState } from 'react';

import { useSignOutMutation } from '../../hooks/mutations/useSignOutMutation';
import { useUser } from '../../hooks/queries/useUser';
import { Authenticated } from './Authenticated';
import { Unauthenticated } from './Unauthenticated';

type NavigationLink = {
	link: string;
	label: string;
};

type Props = {
	className?: string;
	links?: NavigationLink[];
	logo?: string;
};

const FreeEventalPro = (
	<div className="w-full bg-green-500">
		<Link href={`/pricing`}>
			<a className="m-auto block py-1 text-center text-sm text-white">
				Upgrade your event to PRO for free! Click to learn more
			</a>
		</Link>
	</div>
);

export const Navigation: React.FC<Props> = (props) => {
	const { className, ...restProps } = props;
	const [isOpen, setIsOpen] = useState(false);
	const { signOutMutation } = useSignOutMutation();
	const { user } = useUser();

	if (user) {
		return (
			<>
				{FreeEventalPro}
				<Authenticated
					signOutMutation={signOutMutation}
					user={user}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					{...restProps}
				/>
			</>
		);
	}

	return (
		<>
			{FreeEventalPro}
			<Unauthenticated isOpen={isOpen} setIsOpen={setIsOpen} {...restProps} />
		</>
	);
};
