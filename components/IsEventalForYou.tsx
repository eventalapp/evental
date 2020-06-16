import { faGraduationCap, faStreetView, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

import { faCameraWeb, faMicrophoneStand, faPodium } from '../icons';

type Props = React.FC<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>;

export const IsEventalForYou: Props = (props) => {
	const { ...rest } = props;

	return (
		<div {...rest}>
			<h3 className="text-xl font-bold md:text-2xl">Is Evental for you?</h3>
			<p className="mt-1 text-base text-gray-700 md:text-lg"> 
				See why Evental is perfect for your in-person, virtual, or hybrid event.
			</p>
			<div className="grid grid-cols-1 gap-5 mt-6 lg:grid-cols-2 xl:grid-cols-3">
				<Link href="/education">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faGraduationCap}
								/>
								For Educational Events
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your educational/academic events.
							</p>
						</div>
					</a>
				</Link>

				<Link href="/convention">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faPodium}
								/>
								For Conventions
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your convention.
							</p>
						</div>
					</a>
				</Link>

				<Link href="/festival">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faMicrophoneStand}
								/>
								For Festivals
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your festival.
							</p>
						</div>
					</a>
				</Link>

				<Link href="/conference">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faUsers}
								/>
								For Conferences
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your conference.
							</p>
						</div>
					</a>
				</Link>

				<Link href="/virtual">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faCameraWeb}
								/>
								For Virtual Events
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your virtual event.
							</p>
						</div>
					</a>
				</Link>

				<Link href="/hybrid">
					<a>
						<div className="p-4 hover:bg-gray-50 rounded-md border border-gray-200 shadow-sm transition-all duration-100">
							<h4 className="text-xl font-bold text-center">
								<FontAwesomeIcon
									fill="currentColor"
									className="mr-2 w-5 h-5 text-primary"
									size="1x"
									icon={faStreetView}
								/>
								For Hybrid Events
							</h4>
							<p className="mt-2 text-sm text-gray-700">
								See why Evental is the right tool for your hybrid event.
							</p>
						</div>
					</a>
				</Link>
			</div>
		</div>
	);
};
