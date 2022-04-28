import { format } from 'date-fns';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { DatePickerButton } from './DatePickerButton';

export const DatePicker: React.FC<ReactDatePickerProps> = (props) => {
	const { startDate, endDate, selected, onChange, selectsStart, selectsEnd } = props;

	return (
		<ReactDatePicker
			className="input"
			placeholderText="Select date"
			onChange={onChange}
			selected={selected}
			selectsStart={selectsStart}
			selectsEnd={selectsEnd}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-right"
			customInput={<DatePickerButton />}
			startDate={startDate}
			endDate={endDate}
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
								'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
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
								'inline-flex p-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-brand-500'
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
