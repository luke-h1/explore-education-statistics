import ExternalMethodologyForm from '@admin/pages/methodology/external-methodology/components/ExternalMethodologyForm';
import usePublicationContext from '@admin/pages/publication/contexts/PublicationContext';
import {
  PublicationRouteParams,
  publicationMethodologiesRoute,
} from '@admin/routes/publicationRoutes';
import publicationService, {
  ExternalMethodology,
} from '@admin/services/publicationService';
import React from 'react';
import { generatePath } from 'react-router';
import useAsyncHandledRetry from '@common/hooks/useAsyncHandledRetry';
import LoadingSpinner from '@common/components/LoadingSpinner';
import { useNavigate } from 'react-router-dom-v5-compat';

const PublicationExternalMethodologyPage = () => {
  const navigate = useNavigate();
  const { publicationId, publication, onReload } = usePublicationContext();
  const { value: externalMethodology, isLoading } = useAsyncHandledRetry<
    ExternalMethodology | undefined
  >(
    async () => publicationService.getExternalMethodology(publicationId),
    [publicationId],
  );

  const returnRoute = generatePath<PublicationRouteParams>(
    publicationMethodologiesRoute.path,
    {
      publicationId,
    },
  );

  const handleExternalMethodologySubmit = async (
    values: ExternalMethodology,
  ) => {
    if (!publication) {
      return;
    }
    const updatedExternalMethodology: ExternalMethodology = {
      title: values.title,
      url: values.url,
    };

    await publicationService.updateExternalMethodology(
      publicationId,
      updatedExternalMethodology,
    );
    onReload();
    navigate(returnRoute);
  };

  return (
    <LoadingSpinner loading={isLoading}>
      <h2>
        {externalMethodology
          ? 'Edit external methodology link'
          : 'Link to an externally hosted methodology'}
      </h2>
      <ExternalMethodologyForm
        initialValues={externalMethodology}
        onCancel={() => navigate(returnRoute)}
        onSubmit={handleExternalMethodologySubmit}
      />
    </LoadingSpinner>
  );
};

export default PublicationExternalMethodologyPage;
