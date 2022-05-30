import Link from 'next/link';
import React from 'react';

import { BlankLink } from '../BlankLink';

type Props = React.FC;

export const StillNeedHelp: Props = () => {
	return (
		<>
			<span className="text-xl font-bold block leading-none">Still need help?</span>
			<p className="text-gray-700">
				If you are still in need help, reach out to us at{' '}
				<BlankLink href="mailto:support@evental.app" className="underline text-gray-900">
					support@evental.app
				</BlankLink>{' '}
				or fill out a{' '}
				<Link href="/support">
					<a className="underline text-gray-900">support ticket</a>
				</Link>
				.
			</p>
		</>
	);
};
