import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { LinkButton } from './form/LinkButton';
import Column from './layout/Column';
import { Navigation } from './navigation';

const Unauthorized: React.FC = () => {
	return (
		<div>
			<Navigation />

			<Column>
				<h1 className="text-3xl mb-2 font-bold">Unauthorized</h1>
				<span className="mb-5 block">You must sign in to view this page.</span>
				<Link href="/auth/signin" passHref>
					<LinkButton variant="gradient" padding="large">
						Sign in
						<FontAwesomeIcon
							className="cursor-pointer ml-2"
							size="1x"
							icon={faArrowRightToBracket}
						/>
					</LinkButton>
				</Link>
			</Column>
		</div>
	);
};

export default Unauthorized;
