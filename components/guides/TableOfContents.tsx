import Link from 'next/link';
import React from 'react';

export type TableOfContentsItem = {
	text: string;
	relativeLink: string;
};

type Props = React.FC<
	{ items: TableOfContentsItem[] } & React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLUListElement>,
		HTMLUListElement
	>
>;

export const TableOfContents: Props = (props) => {
	const { children, items, ...rest } = props;

	return (
		<>
			<h3 className="mb-2 text-xl font-bold">Table of contents</h3>
			<ul className="list-disc space-y-0.5 pl-5 text-gray-700" {...rest}>
				{items.map((item, i) => (
					<li key={`${item.text}-${i}`}>
						<Link href={item.relativeLink}>
							<a>{item.text}</a>
						</Link>
					</li>
				))}
			</ul>
		</>
	);
};
