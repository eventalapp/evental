import { scrollTo } from '../utils/scroll';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

type Props = {
	page: number;
	pageCount: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
};

export const Pagination: React.FC<Props> = (props) => {
	const { page, pageCount, setPage } = props;

	return (
		<div className="flex flex-row justify-end items-center mt-4">
			<button
				disabled={page <= 1}
				className="disabled:text-gray-300 disabled:cursor-not-allowed"
				onClick={() => {
					if (page > 1) {
						scrollTo(0);
						setPage((oldPage) => oldPage - 1);
					}
				}}
			>
				<FontAwesomeIcon className="mr-1.5" fill="currentColor" icon={faChevronLeft} />
				Prev
			</button>
			<span className="mx-5 text-lg font-medium">
				Page {page}/{pageCount}
			</span>
			<button
				disabled={!(page < pageCount)}
				className="disabled:text-gray-300 disabled:cursor-not-allowed"
				onClick={() => {
					if (page < pageCount) {
						scrollTo(0);
						setPage((oldPage) => oldPage + 1);
					}
				}}
			>
				Next
				<FontAwesomeIcon className="ml-1.5" fill="currentColor" icon={faChevronRight} />
			</button>
		</div>
	);
};
