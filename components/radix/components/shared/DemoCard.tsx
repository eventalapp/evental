import cx from 'classnames';
import React, { ReactNode } from 'react';

enum Variant {
	Default,
	ItemsCenter,
	JustifyCenter
}

type Props = {
	variant?: Variant;
	isNew?: boolean;
	children: ReactNode;
	data: {
		title: string;
		link: string;
	};
};

const DemoCard = ({ variant = Variant.Default, isNew, children, data: { title, link } }: Props) => {
	const id = title.replace(' ', '_').toLowerCase();

	return (
		<section id={id} className="w-full h-[550px] scroll-mt-6 ">
			<div
				className={cx(
					'relative flex h-full w-full p-6 rounded-xl shadow',
					// "bg-gradient-to-br from-pink-300 via-fuchsia-300 to-primary-400 dark:from-pink-800 dark:via-fuchsia-900 dark:to-primary-800"
					// "bg-gradient-to-br from-pink-400 via-fuchsia-300 to-primary-400 dark:from-pink-800 dark:via-fuchsia-900 dark:to-primary-800",
					'bg-gradient-to-br from-pink-300 via-fuchsia-200 to-primary-300 dark:from-pink-800 dark:via-fuchsia-900 dark:to-primary-800',
					{
						[Variant.Default]: 'items-center justify-center',
						[Variant.ItemsCenter]: 'items-center',
						[Variant.JustifyCenter]: 'justify-center pt-24' // Height of title bar
					}[variant]
				)}
			>
				{children}
				<div className="flex absolute inset-x-0 top-0 justify-between items-center py-2.5 px-4 bg-black/50 dark:bg-black/30 rounded-t-xl">
					<div className="flex items-center space-x-2">
						<a
							href={`#${id}`}
							className="text-sm font-medium text-white dark:text-gray-300 select-none"
						>
							{title}
						</a>
						{isNew && (
							<span className="py-0.5 px-1.5 text-[0.6rem] font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 rounded-full select-none">
								NEW
							</span>
						)}
					</div>
					<a
						href={link}
						rel={'noreferrer'}
						target={'_blank'}
						className="py-1.5 px-2 text-xs font-medium text-white dark:text-gray-100 bg-white/25 hover:bg-white/30 rounded select-none"
					>
						Code
					</a>
				</div>
			</div>
		</section>
	);
};

DemoCard.variant = Variant;
export default DemoCard;
