import ButtonLink from '@admin/components/ButtonLink';
import Link from '@admin/components/Link';
import {
  publicationEditRoute,
  PublicationRouteParams,
  releaseCreateRoute,
} from '@admin/routes/routes';
import { MyPublication } from '@admin/services/publicationService';
import { Release } from '@admin/services/releaseService';
import ButtonGroup from '@common/components/ButtonGroup';
import React from 'react';
import { generatePath } from 'react-router';
import NonScheduledReleaseSummary from './NonScheduledReleaseSummary';
import MethodologySummary from './MethodologySummary';

export interface Props {
  publication: MyPublication;
  topicId: string;
  onChangePublication: () => void;
}

const PublicationSummary = ({
  publication,
  topicId,
  onChangePublication,
}: Props) => {
  const { contact, permissions, releases, id, title } = publication;

  const noAmendmentInProgressFilter = (release: Release) =>
    !releases.some(r => r.amendment && r.previousVersionId === release.id);
  return (
    <>
      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--center dfe-flex-underline">
        <div className="dfe-flex-basis--20">
          <h5>Team and contact</h5>
        </div>
        <div className="dfe-flex-basis--60">
          <p
            className="govuk-!-margin-bottom-1"
            data-testid={`Team name for ${publication.title}`}
          >
            {contact?.teamName || 'No team name'}
          </p>
          {contact?.teamEmail && (
            <p>
              <a
                href={`mailto:${contact.teamEmail}`}
                data-testid={`Team email for ${publication.title}`}
              >
                {contact.teamEmail}
              </a>
            </p>
          )}
          <p
            className="govuk-!-margin-bottom-1"
            data-testid={`Contact name for ${publication.title}`}
          >
            {contact?.contactName || 'No contact name'}
          </p>

          {contact?.contactTelNo && (
            <p className="govuk-!-margin-bottom-0">
              <a
                href={`tel:${contact.contactTelNo}`}
                data-testid={`Contact phone number for ${publication.title}`}
              >
                {contact.contactTelNo}
              </a>
            </p>
          )}
        </div>
        <div className="dfe-flex-basis--20">
          {permissions.canUpdatePublication && (
            <Link
              data-testid={`Edit publication link for ${publication.title}`}
              to={generatePath<PublicationRouteParams>(
                publicationEditRoute.path,
                {
                  publicationId: publication.id,
                },
              )}
            >
              Manage this publication
            </Link>
          )}
        </div>
      </div>

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--center dfe-flex-underline">
        <div className="dfe-flex-basis--20">
          <h5>Methodologies</h5>
        </div>
        <div
          className="dfe-flex-basis--80"
          data-testid={`Methodology for ${publication.title}`}
        >
          <MethodologySummary
            publication={publication}
            topicId={topicId}
            onChangePublication={onChangePublication}
          />
        </div>
      </div>

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--center dfe-flex-underline">
        <div className="dfe-flex-basis--20">
          <h5>Current releases</h5>
        </div>
        <div
          className="dfe-flex-basis--80"
          data-testid={`Releases for ${publication.title}`}
        >
          {releases.length > 0 ? (
            <ul className="govuk-list govuk-!-margin-bottom-0">
              {releases.filter(noAmendmentInProgressFilter).map(release => (
                <li key={release.id}>
                  <NonScheduledReleaseSummary
                    includeCreateAmendmentControls
                    onAmendmentCancelled={onChangePublication}
                    release={release}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="govuk-!-margin-bottom-0">No releases created</p>
          )}
        </div>
      </div>

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--center">
        <div className="dfe-flex-basis--20">
          <h5>New release</h5>
        </div>
        <div className="dfe-flex-basis--80">
          <ButtonGroup className="govuk-!-margin-bottom-0">
            {permissions.canCreateReleases && (
              <ButtonLink
                to={generatePath(releaseCreateRoute.path, {
                  publicationId: id,
                })}
                data-testid={`Create new release link for ${title}`}
              >
                Create new release
              </ButtonLink>
            )}
          </ButtonGroup>
        </div>
      </div>
    </>
  );
};

export default PublicationSummary;
