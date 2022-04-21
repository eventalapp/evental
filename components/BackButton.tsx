import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import { Button } from './Form/Button';

export const BackButton: React.FC = () => {
	const router = useRouter();

	return (
		<Button
			variant="link"
			className="mb-1"
			onClick={() => {
				router.back();
			}}
		>
			<FontAwesomeIcon fill="currentColor" className="mr-2" size="1x" icon={faChevronLeft} />
			Back
		</Button>
	);
};
