import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../form/LinkButton';

const NoAccess: React.FC = () => {
	return (
		<>
			<h1 className="text-3xl mt-4 font-bold text-center sm:text-4xl font-display">Unauthorized</h1>
			<p className="mt-3">You do not have access to view this page</p>
			<Link href="/auth/signin" passHref>
				<LinkButton>Sign in</LinkButton>
			</Link>
		</>
	);
};

export default NoAccess;
