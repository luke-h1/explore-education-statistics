import Link from '@admin/components/Link';
import ReleaseDataBlocksPageTabs from '@admin/pages/release/datablocks/components/ReleaseDataBlocksPageTabs';
import {
  releaseDataBlockEditRoute,
  ReleaseDataBlockRouteParams,
  releaseDataBlocksRoute,
  ReleaseRouteParams,
} from '@admin/routes/releaseRoutes';
import { ReleaseDataBlock } from '@admin/services/dataBlockService';
import permissionService from '@admin/services/permissionService';
import WarningMessage from '@common/components/WarningMessage';
import useAsyncHandledRetry from '@common/hooks/useAsyncHandledRetry';
import React, { useCallback } from 'react';
import { generatePath, RouteComponentProps } from 'react-router';

const ReleaseDataBlockCreatePage = ({
  match,
  history,
}: RouteComponentProps<ReleaseRouteParams>) => {
  const {
    params: { publicationId, releaseId },
  } = match;

  const { value: canUpdateRelease } = useAsyncHandledRetry(
    () => permissionService.canUpdateRelease(releaseId),
    [releaseId],
  );

  const handleDataBlockSave = useCallback(
    async (dataBlock: ReleaseDataBlock) => {
      history.push(
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
    [history, publicationId, releaseId],
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

      <h2>Create data block</h2>

      <section>
        {canUpdateRelease ? (
          <ReleaseDataBlocksPageTabs
            releaseId={releaseId}
            onDataBlockSave={handleDataBlockSave}
          />
        ) : (
          <WarningMessage>
            This release has been approved, and can no longer be updated.
          </WarningMessage>
        )}
      </section>
    </>
  );
};

export default ReleaseDataBlockCreatePage;