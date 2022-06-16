import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const FullscreenLinkItem: React.FC<{
	link: string;
	label: string;
	index: number;
	onClick: () => void;
}> = (props) => {
	const { link, label, index, onClick } = props;
	const router = useRouter();

	return (
		<Link href={link} passHref>
			<a
				className={classNames(
					'mb-1.5 cursor-pointer border-b-2',
					router.asPath == link ? 'border-primary' : 'border-transparent'
				)}
				onClick={onClick}
				onKeyDown={onClick}
				role="button"
				tabIndex={index}
			>
				<li
					className={classNames(
						'hover:bg-gray-75 my-1 rounded-md px-3 py-1 text-sm dark:hover:bg-gray-900',
						'dark:text-gray-75 text-sm font-medium',
						router.asPath == link ? 'text-primary' : 'text-gray-900'
					)}
				>
					{label}
				</li>
			</a>
		</Link>
	);
};
