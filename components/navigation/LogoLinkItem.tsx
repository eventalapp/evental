import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

export const LogoLinkItem: React.FC<{
	link?: string;
}> = (props) => {
	const { link = '/' } = props;

	return (
		<Link href={link} passHref>
			<NavigationMenuPrimitive.Link>
				<NavigationMenuPrimitive.Item>
					<span className="flex flex-row items-center">
						<img
							src="https://cdn.evental.app/images/logo.svg"
							className="w-12 h-12 pr-3"
							alt="logo"
						/>
						<strong
							className="text-2xl tracking-tight font-bold font-display"
							aria-label="evental homepage"
						>
							Evental
						</strong>
					</span>
				</NavigationMenuPrimitive.Item>
			</NavigationMenuPrimitive.Link>
		</Link>
	);
};
