import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';

import { NEAREST_MINUTE } from '@eventalapp/shared/utils/config';

import { SessionDatePickerButton } from './SessionDatePickerButton';

type Props = { formatTime?: string } & ReactDatePickerProps;

export const SessionDatePicker: React.FC<Props> = (props) => {
	const {
		startDate,
		endDate,
		selected,
		onChange,
		dateFormat = 'MM/dd/yyyy',
		selectsStart,
		selectsEnd,
		showTimeSelect,
		timeIntervals = NEAREST_MINUTE,
		minDate,
		maxDate,
		renderDayContents
	} = props;

	return (
		<ReactDatePicker
			popperPlacement={'bottom'}
			placeholderText="Select date"
			onChange={onChange}
			selected={selected}
			selectsStart={selectsStart}
			minDate={minDate}
			maxDate={maxDate}
			selectsEnd={selectsEnd}
			dateFormat={dateFormat}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-right"
			customInput={<SessionDatePickerButton endDate={maxDate} startDate={minDate} />}
			startDate={startDate}
			endDate={endDate}
			renderDayContents={renderDayContents}
			showTimeSelect={showTimeSelect}
			timeIntervals={timeIntervals}
			renderCustomHeader={({
				date,
				decreaseMonth,
				increaseMonth,
				prevMonthButtonDisabled,
				nextMonthButtonDisabled
			}) => (
				<div className="flex items-center justify-between p-2">
					<span className="text-lg font-bold text-gray-700">{format(date, 'MMMM yyyy')}</span>

					<div className="space-x-2">
						<button
							onClick={decreaseMonth}
							disabled={prevMonthButtonDisabled}
							type="button"
							className={classNames(
								prevMonthButtonDisabled && 'cursor-not-allowed opacity-50',
								'inline-flex rounded bg-white p-1 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="h-5 w-5 text-gray-600"
								size="1x"
								icon={faChevronLeft}
							/>
						</button>

						<button
							onClick={increaseMonth}
							disabled={nextMonthButtonDisabled}
							type="button"
							className={classNames(
								nextMonthButtonDisabled && 'cursor-not-allowed opacity-50',
								'inline-flex rounded bg-white p-1 text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-0'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="h-5 w-5 text-gray-600"
								size="1x"
								icon={faChevronRight}
							/>
						</button>
					</div>
				</div>
			)}
		/>
	);
};
