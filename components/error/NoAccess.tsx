import Link from 'next/link';
import React from 'react';

import { LinkButton } from '../form/LinkButton';

const NoAccess: React.FC = () => {
	return (
		<>
			<h1 className="text-2xl md:text-3xl mt-4 font-bold text-center sm:text-4xl font-display">
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
