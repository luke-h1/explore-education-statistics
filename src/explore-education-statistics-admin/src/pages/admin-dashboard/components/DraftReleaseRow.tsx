import Link from '@admin/components/Link';
import DraftReleaseRowIssues from '@admin/pages/admin-dashboard/components/DraftReleaseRowIssues';
import { getReleaseApprovalStatusLabel } from '@admin/pages/release/utils/releaseSummaryUtil';
import { Release } from '@admin/services/releaseService';
import {
  ReleaseRouteParams,
  releaseSummaryRoute,
} from '@admin/routes/releaseRoutes';
import ButtonText from '@common/components/ButtonText';
import Tag from '@common/components/Tag';
import VisuallyHidden from '@common/components/VisuallyHidden';
import React from 'react';
import { generatePath } from 'react-router';

interface Props {
  isBauUser: boolean;
  release: Release;
  onDelete: () => void;
}

const DraftReleaseRow = ({ isBauUser, release, onDelete }: Props) => {
  return (
    <tr>
      <td>{release.title}</td>
      <td>
        <Tag>
          {`${getReleaseApprovalStatusLabel(release.approvalStatus)}${
            release.amendment ? ' Amendment' : ''
          }`}
        </Tag>
      </td>
      {!isBauUser && <DraftReleaseRowIssues releaseId={release.id} />}
      <td>
        <Link
          to={generatePath<ReleaseRouteParams>(releaseSummaryRoute.path, {
            publicationId: release.publicationId,
            releaseId: release.id,
          })}
        >
          {release.permissions?.canUpdateRelease ? 'Edit' : 'View'}
          <VisuallyHidden> {release.title}</VisuallyHidden>
        </Link>
        {release.permissions?.canDeleteRelease && release.amendment && (
          <ButtonText className="govuk-!-margin-left-4" onClick={onDelete}>
            Cancel amendment
            <VisuallyHidden> for {release.title}</VisuallyHidden>
          </ButtonText>
        )}

        {release.amendment && (
          <Link
            className="govuk-!-margin-left-4"
            to={generatePath<ReleaseRouteParams>(releaseSummaryRoute.path, {
              publicationId: release.publicationId,
              releaseId: release.previousVersionId,
            })}
          >
            View original
            <VisuallyHidden> for {release.title}</VisuallyHidden>
          </Link>
        )}
      </td>
    </tr>
  );
};

export default DraftReleaseRow;