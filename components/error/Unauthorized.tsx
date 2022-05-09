import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../form/LinkButton';
import { useRouter } from 'next/router';

const Unauthorized: React.FC = () => {
	const router = useRouter();

	let params = new URLSearchParams();

	params.append('redirectUrl', String(router.asPath));

	return (
		<>
			<h1 className="text-2xl md:text-3xl mb-2 font-bold">Unauthorized</h1>
			<span className="mb-5 block">You must sign in to view this page.</span>
			<Link href={`/auth/signin?${params}`} passHref>
				<LinkButton padding="large">Sign in</LinkButton>
			</Link>
		</>
	);
};

export default Unauthorized;
