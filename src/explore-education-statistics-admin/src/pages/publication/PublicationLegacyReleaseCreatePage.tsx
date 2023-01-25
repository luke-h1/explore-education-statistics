import Link from '@admin/components/Link';
import LegacyReleaseForm from '@admin/pages/legacy-releases/components/LegacyReleaseForm';
import usePublicationContext from '@admin/pages/publication/contexts/PublicationContext';
import { publicationLegacyReleasesRoute } from '@admin/routes/publicationRoutes';
import legacyReleaseService from '@admin/services/legacyReleaseService';
import React from 'react';
import { generatePath } from 'react-router';
import { useNavigate } from 'react-router-dom-v5-compat';

const PublicationLegacyReleaseCreatePage = () => {
  const { publicationId } = usePublicationContext();
  const navigate = useNavigate();

  const publicationEditPath = generatePath(
    publicationLegacyReleasesRoute.path,
    {
      publicationId,
    },
  );

  return (
    <>
      <h2>Create legacy release</h2>
      <LegacyReleaseForm
        cancelButton={
          <Link unvisited to={publicationEditPath}>
            Cancel
          </Link>
        }
        onSubmit={async values => {
          await legacyReleaseService.createLegacyRelease({
            description: values.description,
            url: values.url,
            publicationId,
          });

          navigate(publicationEditPath);
        }}
      />
    </>
  );
};

export default PublicationLegacyReleaseCreatePage;
