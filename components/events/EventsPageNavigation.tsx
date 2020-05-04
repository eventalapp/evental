import Link from 'next/link';
import { LinkButton } from '../form/LinkButton';
import React from 'react';
import { useRouter } from 'next/router';

export const EventsPageNavigation: React.FC = () => {
	const router = useRouter();

	return (
		<div className="mb-3 flex flex-row justify-center">
			<Link href="/events/organizing" passHref>
				<LinkButton
					className="mr-3"
					variant={router.pathname == '/events/organizing' ? 'primary' : 'inversePrimary'}
				>
					Organizing
				</LinkButton>
			</Link>
			<Link href="/events/attending" passHref>
				<LinkButton
					className="mr-3"
					variant={router.pathname == '/events/attending' ? 'primary' : 'inversePrimary'}
				>
					Attending
				</LinkButton>
			</Link>
			<Link href="/events" passHref>
				<LinkButton
					className="mr-3"
					variant={router.pathname == '/events' ? 'primary' : 'inversePrimary'}
				>
					Upcoming
				</LinkButton>
			</Link>
		</div>
	);
};
