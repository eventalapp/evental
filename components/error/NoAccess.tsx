import Link from 'next/link';
import React from 'react';

import { LinkButton } from '../form/LinkButton';

const NoAccess: React.FC = () => {
	return (
		<>
			<h1 className="mt-4 text-center font-display text-2xl font-bold sm:text-4xl md:text-3xl">
				No Access
			</h1>
			<p className="my-3">You do not have access to view this page</p>
			<Link href="/events/" passHref>
				<LinkButton>Return to events</LinkButton>
			</Link>
		</>
	);
};

export default NoAccess;
