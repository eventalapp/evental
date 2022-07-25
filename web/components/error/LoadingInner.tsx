import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faSpinnerThird } from '@eventalapp/shared/utils/icons';

export const LoadingInner = () => {
	return (
		<>
			<FontAwesomeIcon
				fill="currentColor"
				className="mr-2 h-3 w-3 animate-spin"
				size="1x"
				icon={faSpinnerThird}
			/>
			Loading...
		</>
	);
};
