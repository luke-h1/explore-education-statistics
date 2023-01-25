import AdoptMethodologyForm from '@admin/pages/methodology/adopt-methodology/components/AdoptMethodologyForm';
import usePublicationContext from '@admin/pages/publication/contexts/PublicationContext';
import {
  PublicationRouteParams,
  publicationMethodologiesRoute,
} from '@admin/routes/publicationRoutes';
import publicationService from '@admin/services/publicationService';
import LoadingSpinner from '@common/components/LoadingSpinner';
import useAsyncHandledRetry from '@common/hooks/useAsyncHandledRetry';
import React from 'react';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom-v5-compat';

const PublicationAdoptMethodologyPage = () => {
  const navigate = useNavigate();

  const { publicationId } = usePublicationContext();

  const { value: adoptableMethodologies, isLoading } = useAsyncHandledRetry(
    async () => publicationService.getAdoptableMethodologies(publicationId),
  );

  const returnRoute = generatePath<PublicationRouteParams>(
    publicationMethodologiesRoute.path,
    {
      publicationId,
    },
  );

  return (
    <>
      <h2>Adopt a methodology</h2>
      <LoadingSpinner loading={isLoading}>
        {adoptableMethodologies && adoptableMethodologies.length > 0 ? (
          <AdoptMethodologyForm
            methodologies={adoptableMethodologies}
            onCancel={() => navigate(returnRoute)}
            onSubmit={async values => {
              await publicationService.adoptMethodology(
                publicationId,
                values.methodologyId,
              );
              navigate(returnRoute);
            }}
          />
        ) : (
          <p>No methodologies available.</p>
        )}
      </LoadingSpinner>
    </>
  );
};

export default PublicationAdoptMethodologyPage;
