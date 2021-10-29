import ReleaseServiceStatus from '@admin/components/ReleaseServiceStatus';
import {
  getReleaseApprovalStatusLabel,
  getReleaseSummaryLabel,
} from '@admin/pages/release/utils/releaseSummaryUtil';
import { Release } from '@admin/services/releaseService';
import Details from '@common/components/Details';
import FormattedDate from '@common/components/FormattedDate';
import SummaryList from '@common/components/SummaryList';
import SummaryListItem from '@common/components/SummaryListItem';
import Tag from '@common/components/Tag';
import TagGroup from '@common/components/TagGroup';
import {
  formatPartialDate,
  isValidPartialDate,
} from '@common/utils/date/partialDate';
import React, { ReactNode } from 'react';
import LazyLoad from 'react-lazyload';
import LoadingSpinner from '@common/components/LoadingSpinner';

interface Props {
  release: Release;
  actions: ReactNode;
  secondaryActions?: ReactNode;
  open?: boolean;
  children?: ReactNode;
}

const ReleaseSummary = ({
  release,
  actions,
  secondaryActions,
  open = false,
  children,
}: Props) => {
  return (
    <Details
      open={open}
      className="govuk-!-margin-bottom-4"
      summary={getReleaseSummaryLabel(release)}
      summaryAfter={
        <TagGroup className="govuk-!-margin-left-2">
          {release.approvalStatus !== 'Approved' && (
            <>
              {' '}
              <Tag>{getReleaseApprovalStatusLabel(release.approvalStatus)}</Tag>
            </>
          )}
          {release.approvalStatus === 'Approved' && (
            <LazyLoad
              once
              placeholder={
                <LoadingSpinner className="govuk-!-margin-0" inline size="sm" />
              }
            >
              <>
                {' '}
                <ReleaseServiceStatus
                  exclude="details"
                  releaseId={release.id}
                  isApproved
                />
              </>
            </LazyLoad>
          )}
          {release.amendment && (
            <>
              {' '}
              <Tag>Amendment</Tag>
            </>
          )}
        </TagGroup>
      }
    >
      <div className="dfe-flex">
        <div className="dfe-flex-basis--75">
          <SummaryList className="govuk-!-margin-bottom-3">
            <SummaryListItem term="Publish date">
              {((release.published !== undefined ||
                release.publishScheduled !== undefined) && (
                <>
                  <FormattedDate>
                    {release.published || release.publishScheduled || ''}
                  </FormattedDate>
                </>
              )) || <>N/A</>}
            </SummaryListItem>

            {isValidPartialDate(release.nextReleaseDate) && (
              <SummaryListItem term="Next release date">
                <time>{formatPartialDate(release.nextReleaseDate)}</time>
              </SummaryListItem>
            )}
            {release.approvalStatus === 'Approved' && (
              <SummaryListItem term="Release process status">
                <ReleaseServiceStatus releaseId={release.id} />
              </SummaryListItem>
            )}
            <SummaryListItem term="Lead statistician">
              {release.contact && (
                <span>
                  {release.contact.contactName}
                  <br />
                  <a href="mailto:{lead.teamEmail}">
                    {release.contact.teamEmail}
                  </a>
                  <br />
                  {release.contact.contactTelNo}
                </span>
              )}
            </SummaryListItem>
            {release.latestInternalReleaseNote && (
              <SummaryListItem term="Internal note">
                <span className="dfe-multiline-content">
                  {release.latestInternalReleaseNote}
                </span>
              </SummaryListItem>
            )}
          </SummaryList>
          {children}
        </div>
        <div className="dfe-flex-basis--25">
          <div className="dfe-flex dfe-flex-direction--column dfe-justify-content--flex-end govuk-!-margin-left-4 govuk-!-padding-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
            {actions}
            {secondaryActions}
          </div>
        </div>
      </div>
    </Details>
  );
};

export default ReleaseSummary;
