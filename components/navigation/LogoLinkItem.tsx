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
							className="h-12 w-12 pr-3"
							alt="logo"
						/>
						<strong
							className="font-display text-2xl font-bold tracking-tight"
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
