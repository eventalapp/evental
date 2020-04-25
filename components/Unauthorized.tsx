import Link from 'next/link';
import React from 'react';
import Column from './Column';
import { Navigation } from './navigation';

const Unauthorized: React.FC = () => {
	return (
		<div>
			<Navigation />

			<Column>
				<h1 className="mt-4 text-3xl font-bold text-center sm:text-4xl font-display">
					Unauthorized
				</h1>
				<p className="mt-3">You must sign in to view this page</p>
				<Link href="/auth/signin" passHref>
					<a className="mt-3 text-blue-900 block">Sign in</a>
				</Link>
			</Column>
		</div>
	);
};

export default Unauthorized;
