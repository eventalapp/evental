import Link from 'next/link';
import React from 'react';
import { LinkButton } from '../form/LinkButton';

export const NotFound: React.FC<{ message?: string }> = (props) => {
	const { message = 'Not found.' } = props;

	return (
		<div>
			<h1 className="text-3xl font-bold">Not Found</h1>
			<p className="my-3">{message}</p>
			<Link href="/events">
				<LinkButton>Go to events</LinkButton>
			</Link>
		</div>
	);
};
