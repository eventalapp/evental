import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import React from 'react';
import ReactDatePicker, {
	ReactDatePickerCustomHeaderProps,
	ReactDatePickerProps
} from 'react-datepicker';

import { NEAREST_MINUTE } from '@eventalapp/shared/utils/config';

import { DatePickerButton } from './DatePickerButton';

type Props = { formatTime?: string; color?: string } & ReactDatePickerProps;

export const renderCustomHeader = ({
	date,
	decreaseMonth,
	increaseMonth,
	prevMonthButtonDisabled,
	nextMonthButtonDisabled
}: Pick<
	ReactDatePickerCustomHeaderProps,
	'date' | 'increaseMonth' | 'decreaseMonth' | 'nextMonthButtonDisabled' | 'prevMonthButtonDisabled'
>) => (
	<CustomDatePickerHeader
		date={date}
		decreaseMonth={decreaseMonth}
		increaseMonth={increaseMonth}
		prevMonthButtonDisabled={prevMonthButtonDisabled}
		nextMonthButtonDisabled={nextMonthButtonDisabled}
	/>
);

export const CustomDatePickerHeader: React.FC<
	Pick<
		ReactDatePickerCustomHeaderProps,
		| 'date'
		| 'increaseMonth'
		| 'decreaseMonth'
		| 'nextMonthButtonDisabled'
		| 'prevMonthButtonDisabled'
	>
> = ({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
	return (
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
	);
};

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
		selectsRange,
		timeIntervals = NEAREST_MINUTE,
		formatTime = 'DD/MM/YYYY',
		minDate,
		maxDate,
		color
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
			selectsRange={selectsRange}
			nextMonthButtonLabel=">"
			previousMonthButtonLabel="<"
			popperClassName="react-datepicker-right"
			customInput={
				<DatePickerButton color={color}>
					{selected && dayjs(selected).format(formatTime)}
				</DatePickerButton>
			}
			startDate={startDate}
			endDate={endDate}
			showTimeSelect={showTimeSelect}
			timeIntervals={timeIntervals}
			renderCustomHeader={renderCustomHeader}
		/>
	);
};
