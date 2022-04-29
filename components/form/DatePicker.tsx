import { format } from 'date-fns';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { DatePickerButton } from './DatePickerButton';
import { NEAREST_MINUTE } from '../../config';

type Props = { formatTime?: string } & ReactDatePickerProps;

export const DatePicker: React.FC<Props> = (props) => {
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
		formatTime = 'MM/dd/yyyy'
	} = props;

	return (
		<ReactDatePicker
			popperPlacement={'bottom'}
			className="input"
			placeholderText="Select date"
			onChange={onChange}
			selected={selected}
			selectsStart={selectsStart}
			selectsEnd={selectsEnd}
			dateFormat={dateFormat}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-right"
			customInput={<DatePickerButton value={selected} formatTime={formatTime} />}
			startDate={startDate}
			endDate={endDate}
			showTimeSelect={showTimeSelect}
			timeIntervals={timeIntervals}
			renderCustomHeader={({
				date,
				decreaseMonth,
				increaseMonth,
				prevMonthButtonDisabled,
				nextMonthButtonDisabled
			}) => (
				<div className="flex items-center justify-between px-2 py-2">
					<span className="text-lg text-gray-700 font-bold">{format(date, 'MMMM yyyy')}</span>

					<div className="space-x-2">
						<button
							onClick={decreaseMonth}
							disabled={prevMonthButtonDisabled}
							type="button"
							className={classNames(
								prevMonthButtonDisabled && 'cursor-not-allowed opacity-50',
								'inline-flex p-1 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 text-gray-600"
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
								'inline-flex p-1 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-primary-500'
							)}
						>
							<FontAwesomeIcon
								fill="currentColor"
								className="w-5 h-5 text-gray-600"
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
