import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../form/LinkButton';

const Unauthorized: React.FC = () => {
	return (
		<>
			<h1 className="text-3xl mb-2 font-bold">Unauthorized</h1>
			<span className="mb-5 block">You must sign in to view this page.</span>
			<Link href="/auth/signin" passHref>
				<LinkButton padding="large">Sign in</LinkButton>
			</Link>
		</>
	);
};

export default Unauthorized;
