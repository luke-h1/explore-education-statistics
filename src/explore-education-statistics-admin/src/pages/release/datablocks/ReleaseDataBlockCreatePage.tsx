import Link from '@admin/components/Link';
import DataBlockPageTabs from '@admin/pages/release/datablocks/components/DataBlockPageTabs';
import {
  releaseDataBlockEditRoute,
  ReleaseDataBlockRouteParams,
  releaseDataBlocksRoute,
  ReleaseRouteParams,
} from '@admin/routes/releaseRoutes';
import { ReleaseDataBlock } from '@admin/services/dataBlockService';
import permissionService from '@admin/services/permissionService';
import LoadingSpinner from '@common/components/LoadingSpinner';
import WarningMessage from '@common/components/WarningMessage';
import useAsyncHandledRetry from '@common/hooks/useAsyncHandledRetry';
import React, { useCallback } from 'react';
import { generatePath, useParams } from 'react-router';
import { useNavigate } from 'react-router-dom-v5-compat';

const ReleaseDataBlockCreatePage = () => {
  const { releaseId, publicationId } = useParams<ReleaseRouteParams>();
  const navigate = useNavigate();

  const { value: canUpdateRelease, isLoading } = useAsyncHandledRetry(
    () => permissionService.canUpdateRelease(releaseId),
    [releaseId],
  );

  const handleDataBlockSave = useCallback(
    async (dataBlock: ReleaseDataBlock) => {
      navigate(
        generatePath<ReleaseDataBlockRouteParams>(
          releaseDataBlockEditRoute.path,
          {
            publicationId,
            releaseId,
            dataBlockId: dataBlock.id,
          },
        ),
      );
    },
    [navigate, publicationId, releaseId],
  );

  return (
    <>
      <Link
        back
        className="govuk-!-margin-bottom-6"
        to={generatePath<ReleaseRouteParams>(releaseDataBlocksRoute.path, {
          publicationId,
          releaseId,
        })}
      >
        Back
      </Link>

      <LoadingSpinner loading={isLoading}>
        <h2>Create data block</h2>

        <section>
          {canUpdateRelease ? (
            <DataBlockPageTabs
              releaseId={releaseId}
              onDataBlockSave={handleDataBlockSave}
            />
          ) : (
            <WarningMessage>
              This release has been approved, and can no longer be updated.
            </WarningMessage>
          )}
        </section>
      </LoadingSpinner>
    </>
  );
};

export default ReleaseDataBlockCreatePage;
