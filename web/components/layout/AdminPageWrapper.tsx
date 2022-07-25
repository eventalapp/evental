import { ErroredAPIResponse } from 'nextkit';
import React from 'react';

import { useIsFounder, useIsOrganizer, useUser } from '@eventalapp/shared/hooks';

import { NoAccessPage } from '../error/NoAccessPage';
import { UnauthorizedPage } from '../error/UnauthorizedPage';
import { ViewErrorPage } from '../error/ViewErrorPage';

type AdminPageWrapperProps = {
	isLoading?: boolean;
	errors?: Array<ErroredAPIResponse | null>;
	eid: string;
	founderPage?: boolean;
};

export const AdminPageWrapper: React.FC<AdminPageWrapperProps> = (props) => {
	const { children, isLoading, errors, eid, founderPage = false } = props;
	const { data: user, isLoading: isUserLoading } = useUser();
	const { data: isOrganizer, isLoading: isOrganizerLoading } = useIsOrganizer({ eid: String(eid) });
	const { isLoading: isFounderLoading, data: isFounder } = useIsFounder({ eid: String(eid) });

	const isLoadingMerged = isUserLoading || isOrganizerLoading || isLoading || isFounderLoading;

	if (founderPage && !isLoadingMerged && !isFounder) {
		return <NoAccessPage />;
	}

	if (errors && errors.some((error) => error !== null)) {
		return <ViewErrorPage errors={errors} eid={eid} admin />;
	}

	if (!isLoadingMerged && !user?.id) {
		return <UnauthorizedPage />;
	}

	if (!isLoadingMerged && !isOrganizer) {
		return <NoAccessPage />;
	}

	return <>{children}</>;
};
