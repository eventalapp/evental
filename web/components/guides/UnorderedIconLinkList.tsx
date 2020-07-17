import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

export type UnorderedIconListItem = {
	text: string;
	relativeLink: string;
	icon?: IconDefinition;
};

type Props = React.FC<
	{ items: UnorderedIconListItem[] } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	>
>;

export const UnorderedIconLinkList: Props = (props) => {
	const { children, items, ...rest } = props;

	return (
		<ul className="space-y-0.5 pt-4" {...rest}>
			{items.map((item, i) => {
				const { text, relativeLink, icon = faFile } = item;

				return (
					<li key={`${text}-${i}`}>
						<Link href={relativeLink}>
							<a>
								<FontAwesomeIcon
									className="cursor-pointer pr-2 text-primary-400"
									size="1x"
									icon={icon}
								/>
								{text}
							</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
