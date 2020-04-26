import Link from 'next/link';
import React from 'react';
import Column from './layout/Column';
import { Navigation } from './navigation';
import { LinkButton } from './form/LinkButton';

const NoAccess: React.FC = () => {
	return (
		<div>
			<Navigation />

			<Column>
				<h1 className="mt-4 text-3xl font-bold text-center sm:text-4xl font-display">
					Unauthorized
				</h1>
				<p className="mt-3">You do not have access to view this page</p>
				<Link href="/auth/signin" passHref>
					<LinkButton variant="gradient" />
				</Link>
			</Column>
		</div>
	);
};

export default NoAccess;
