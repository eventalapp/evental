import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { LinkButton } from '../primitives/LinkButton';

const Unauthorized: React.FC = () => {
	const router = useRouter();

	let params = new URLSearchParams();

	params.append('redirectUrl', String(router.asPath));

	return (
		<>
			<h1 className="mb-2 text-2xl font-bold md:text-3xl">Unauthorized</h1>
			<span className="mb-5 block">You must sign in to view this page.</span>
			<Link href={`/auth/signin?${params}`} passHref>
				<LinkButton padding="large" variant="primary">
					Sign in
				</LinkButton>
			</Link>
		</>
	);
};

export default Unauthorized;
