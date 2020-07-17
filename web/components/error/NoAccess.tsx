import Link from 'next/link';
import React from 'react';

import { LinkButton } from '../primitives/LinkButton';

type Props = {
	message?: string | undefined;
};

const NoAccess: React.FC<Props> = (props) => {
	const { message = 'You do not have access to view this page' } = props;
	return (
		<>
			<h1 className="mt-4 text-center font-display text-2xl font-bold sm:text-4xl md:text-3xl">
				No Access
			</h1>
			<p className="my-3">{message}</p>
			<Link href="/events/" passHref>
				<LinkButton variant="primary">Return to events</LinkButton>
			</Link>
		</>
	);
};

export default NoAccess;
