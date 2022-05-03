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

	console.log(router.pathname);

	return (
		<div className="w-full border-b-2 border-gray-300">
			<Link href={`/events/${eid}/admin`} passHref>
				<a
					className={classNames(
						'px-5 py-3 inline-block font-semibold text-gray-500',
						router.pathname == `/events/${eid}/admin` && 'text-primary font-bold'
					)}
				>
					General Settings
				</a>
			</Link>
		</div>
	);
};
