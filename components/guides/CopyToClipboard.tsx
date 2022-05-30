import React from 'react';
import { toast } from 'react-toastify';

import Tooltip from '../radix/components/Tooltip';

type Props = React.FC<{ tooltipText?: string; text?: string; link: string }>;

export const CopyToClipboard: Props = (props) => {
	const { text = '#', tooltipText = 'Copy link to clipboard', link } = props;

	return (
		<Tooltip side={'top'} message={tooltipText}>
			<span
				className="text-primary font-bold cursor-pointer ml-1.5"
				onClick={() => {
					navigator.clipboard.writeText(link).then(() => {
						toast.success('Link successfully copied to clipboard.');
					});
				}}
			>
				{text}
			</span>
		</Tooltip>
	);
};
