import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

type Props = {
	eid: string;
};

export const EventSettingsNavigation: React.FC<Props> = (props) => {
	const { eid } = props;
	const router = useRouter();

	return (
		<div className="w-full border-b border-gray-300 mb-3">
			<Link href={`/events/${eid}/admin`} passHref>
				<a
					className={classNames(
						'px-3 py-2 inline-block font-medium',
						router.asPath == `/events/${eid}/admin`
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500'
					)}
				>
					General Settings
				</a>
			</Link>
			<Link href={`/events/${eid}/admin/roles`} passHref>
				<a
					className={classNames(
						'px-3 py-2 inline-block font-medium',
						router.asPath == `/events/${eid}/admin/roles`
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500'
					)}
				>
					Roles
				</a>
			</Link>
			<Link href={`/events/${eid}/admin/venues`} passHref>
				<a
					className={classNames(
						'px-3 py-2 inline-block font-medium',
						router.asPath == `/events/${eid}/admin/venues`
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500'
					)}
				>
					Venues
				</a>
			</Link>
			<Link href={`/events/${eid}/admin/sessions`} passHref>
				<a
					className={classNames(
						'px-3 py-2 inline-block font-medium',
						router.asPath == `/events/${eid}/admin/sessions`
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500'
					)}
				>
					Session
				</a>
			</Link>
			<Link href={`/events/${eid}/admin/attendees`} passHref>
				<a
					className={classNames(
						'px-3 py-2 inline-block font-medium',
						router.asPath == `/events/${eid}/admin/attendees`
							? 'text-primary border-b-2 border-primary'
							: 'text-gray-500'
					)}
				>
					Attendees
				</a>
			</Link>
		</div>
	);
};
