import classNames from 'classnames';
import React from 'react';

const variants = {
	primary:
		'w-full px-3 py-2 text-md font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-secondary'
};

type Props = {
	className?: string;
	variant?: keyof typeof variants;
	[x: string]: unknown;
} & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
	const { className, children, variant = 'primary', ...rest } = props;

	return (
		<textarea className={classNames(variants[variant], className)} ref={ref} {...rest}>
			{children}
		</textarea>
	);
});
