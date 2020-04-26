import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { LinkButton } from './form/LinkButton';
import Link from 'next/link';
import { LinkProps } from 'next/dist/client/link';

type Props = LinkProps;

export const BackButton: React.FC<Props> = (props) => {
	const { children, href } = props;

	return (
		<Link href={href} passHref>
			<LinkButton variant="no-bg" padding="none" className="mb-1">
				<FontAwesomeIcon fill="currentColor" className="mr-2" size="1x" icon={faChevronLeft} />
				{children}
			</LinkButton>
		</Link>
	);
};
