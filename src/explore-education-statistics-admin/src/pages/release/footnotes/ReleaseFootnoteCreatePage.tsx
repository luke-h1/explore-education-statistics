import Link from '@admin/components/Link';
import FootnoteForm from '@admin/pages/release/footnotes/components/FootnoteForm';
import {
  releaseFootnotesRoute,
  ReleaseRouteParams,
} from '@admin/routes/releaseRoutes';
import footnoteService from '@admin/services/footnoteService';
import LoadingSpinner from '@common/components/LoadingSpinner';
import useAsyncHandledRetry from '@common/hooks/useAsyncHandledRetry';
import React from 'react';
import { generatePath } from 'react-router';
import { useNavigate , useParams } from 'react-router-dom-v5-compat';

const ReleaseFootnoteCreatePage = () => {
  const { publicationId, releaseId } = useParams<ReleaseRouteParams>();
  const navigate = useNavigate();

  const { value: footnoteMeta, isLoading } = useAsyncHandledRetry(
    () => footnoteService.getFootnoteMeta(releaseId),
    [releaseId],
  );

  const footnotesPath = generatePath<ReleaseRouteParams>(
    releaseFootnotesRoute.path,
    {
      publicationId,
      releaseId,
    },
  );

  return (
    <>
      <Link to={footnotesPath} back className="govuk-!-margin-bottom-6">
        Back
      </Link>

      <LoadingSpinner loading={isLoading}>
        <h2>Create footnote</h2>

        {footnoteMeta && (
          <FootnoteForm
            footnoteMeta={footnoteMeta}
            onSubmit={async values => {
              await footnoteService.createFootnote(releaseId, values);
              navigate(footnotesPath);
            }}
            cancelButton={
              <Link unvisited to={footnotesPath}>
                Cancel
              </Link>
            }
          />
        )}
      </LoadingSpinner>
    </>
  );
};

export default ReleaseFootnoteCreatePage;
