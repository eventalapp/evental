import Link from 'next/link';
import React from 'react';
import { BackButton } from './BackButton';
import Column from './Column';
import { Navigation } from './Navigation';

const NoAccess: React.FC = (props) => {
	return (
		<>
			<Navigation />

			<Column>
				<h1 className="mt-4 text-3xl font-bold text-center sm:text-4xl font-display">
					Unauthorized
				</h1>
				<p className="mt-3">You do not have access to view this page</p>
				<Link href="/auth/signin" passHref>
					<BackButton />
				</Link>
			</Column>
		</>
	);
};

export default NoAccess;
