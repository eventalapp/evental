import Link from 'next/link';
import React from 'react';

import { BlankLink } from '../primitives/BlankLink';

type Props = React.FC;

export const StillNeedHelp: Props = () => {
	return (
		<>
			<span className="block text-xl font-bold leading-none">Still need help?</span>
			<p className="text-gray-700">
				If you are still in need help, reach out to us at{' '}
				<BlankLink href="mailto:support@evental.app" className="text-gray-900 underline">
					support@evental.app
				</BlankLink>{' '}
				or fill out a{' '}
				<Link href="/support">
					<a className="text-gray-900 underline">support ticket</a>
				</Link>
				.
			</p>
		</>
	);
};
