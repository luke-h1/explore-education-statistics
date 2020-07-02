import Link from '@admin/components/Link';
import { useManageReleaseContext } from '@admin/pages/release/contexts/ManageReleaseContext';
import { summaryEditRoute } from '@admin/routes/releaseRoutes';
import metaService, {
  TimePeriodCoverageGroup,
} from '@admin/services/metaService';
import permissionService from '@admin/services/permissionService';
import releaseService, { ReleaseSummary } from '@admin/services/releaseService';
import { IdTitlePair } from '@admin/services/types/common';
import FormattedDate from '@common/components/FormattedDate';
import SummaryList from '@common/components/SummaryList';
import SummaryListItem from '@common/components/SummaryListItem';
import {
  formatDayMonthYear,
  isValidDayMonthYear,
} from '@common/utils/date/dayMonthYear';
import React, { useEffect, useState } from 'react';

interface ReleaseSummaryModel {
  releaseSummaryDetails: ReleaseSummary;
  timePeriodCoverageGroups: TimePeriodCoverageGroup[];
  releaseTypes: IdTitlePair[];
  canEditRelease: boolean;
}

const ReleaseSummaryPage = () => {
  const [model, setModel] = useState<ReleaseSummaryModel>();

  const { publication, releaseId } = useManageReleaseContext();

  useEffect(() => {
    Promise.all([
      releaseService.getReleaseSummary(releaseId),
      metaService.getReleaseTypes(),
      metaService.getTimePeriodCoverageGroups(),
      permissionService.canUpdateRelease(releaseId),
    ]).then(
      ([
        releaseSummaryDetails,
        releaseTypes,
        timePeriodCoverageGroups,
        canEditRelease,
      ]) => {
        setModel({
          releaseSummaryDetails,
          timePeriodCoverageGroups,
          releaseTypes,
          canEditRelease,
        });
      },
    );
  }, [releaseId]);

  return (
    <>
      <h2 className="govuk-heading-l">Release summary</h2>
      <p>These details will be shown to users to help identify this release.</p>
      {model && (
        <>
          <SummaryList>
            <SummaryListItem term="Publication title">
              {publication.title}
            </SummaryListItem>
            <SummaryListItem term="Time period">
              {model.releaseSummaryDetails.timePeriodCoverage.label}
            </SummaryListItem>
            <SummaryListItem term="Release period">
              <time>{model.releaseSummaryDetails.yearTitle}</time>
            </SummaryListItem>
            <SummaryListItem term="Lead statistician">
              {publication.contact && publication.contact.contactName}
            </SummaryListItem>
            <SummaryListItem term="Scheduled release">
              <FormattedDate>
                {model.releaseSummaryDetails.publishScheduled}
              </FormattedDate>
            </SummaryListItem>
            <SummaryListItem term="Next release expected">
              {isValidDayMonthYear(
                model.releaseSummaryDetails.nextReleaseDate,
              ) && (
                <time>
                  {formatDayMonthYear(
                    model.releaseSummaryDetails.nextReleaseDate,
                  )}
                </time>
              )}
            </SummaryListItem>
            <SummaryListItem term="Release type">
              {model.releaseSummaryDetails.type.title}
            </SummaryListItem>
          </SummaryList>
          {model.canEditRelease && (
            <div className="dfe-align--right">
              <Link
                to={summaryEditRoute.generateLink({
                  publicationId: publication.id,
                  releaseId,
                })}
              >
                Edit release summary
              </Link>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ReleaseSummaryPage;