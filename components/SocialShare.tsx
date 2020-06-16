import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFacebook, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Prisma from '@prisma/client';
import classNames from 'classnames';
import React from 'react';
import { emailLink } from '../utils/sharing/email';
import { facebookLink } from '../utils/sharing/facebook';
import { linkedinLink } from '../utils/sharing/linkedin';
import { twitterLink } from '../utils/sharing/twitter';
import Tooltip from './radix/components/Tooltip';

type Props = { className?: string; event: Prisma.Event } & React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export const SocialShareIcon: React.FC<{
	href: string;
	icon: IconDefinition;
	tooltipMessage: string;
	className?: string;
}> = (props) => {
	const { href, icon, tooltipMessage, className } = props;

	return (
		<Tooltip message={tooltipMessage} side="top">
			<a target="_blank" rel="noopener noreferrer" href={href}>
				<div
					className={classNames(
						`w-8 h-8 flex items-center justify-center rounded-md cursor-pointer`,
						className
					)}
				>
					<FontAwesomeIcon fill="currentColor" className="w-5 h-5 " size="1x" icon={icon} />
				</div>
			</a>
		</Tooltip>
	);
};

export const SocialShare: React.FC<Props> = (props) => {
	const { children, className, event, ...rest } = props;

	return (
		<div className={classNames('flex flex-row justify-between', className)} {...rest}>
			<SocialShareIcon
				icon={faTwitter}
				href={twitterLink(
					`${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${event.slug}`,
					{
						title: `Checkout ${event.name} on Evental!`,
						hashtags: ['evental', 'eventalapp'],
						via: 'eventaldotapp',
						related: ['eventalapp', 'eventalapp.com']
					}
				)}
				className="text-[#1DA1F2]"
				tooltipMessage="Click to share this event to Twitter."
			/>

			<SocialShareIcon
				icon={faFacebook}
				href={facebookLink(
					`${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${event.slug}`,
					{
						quote: `Checkout ${event.name} on Evental!`,
						hashtag: 'evental'
					}
				)}
				className="text-[#4267B2]"
				tooltipMessage="Click to share this event to Facebook."
			/>

			<SocialShareIcon
				icon={faLinkedin}
				href={linkedinLink(
					`${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${event.slug}`,
					{
						source: 'Evental',
						title: `Checkout ${event.name} on Evental!`,
						summary: `Checkout ${event.name} on Evental!`
					}
				)}
				className="text-[#0077B5]"
				tooltipMessage="Click to share this event to LinkedIn."
			/>

			<SocialShareIcon
				icon={faPaperPlane}
				href={emailLink(
					`${process.env.NEXT_PUBLIC_VERCEL_URL ?? 'https://evental.app'}/events/${event.slug}`,
					{
						body: `Join me at ${event.name} on Evental!`,
						separator: '\n',
						subject: `Checkout ${event.name} on Evental!`
					}
				)}
				className="text-primary-500"
				tooltipMessage="Click to share this event via email."
			/>
		</div>
	);
};
