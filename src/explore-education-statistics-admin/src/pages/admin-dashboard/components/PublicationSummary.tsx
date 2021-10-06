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
import WarningMessage from '@common/components/WarningMessage';
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
      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--top dfe-flex-underline govuk-!-padding-bottom-6 govuk-!-padding-top-3">
        <div className="dfe-flex-basis--20">
          <h5 className="govuk-!-margin-top-0">Publication team</h5>
        </div>
        <div className="dfe-flex-basis--80 dfe-flex dfe-flex-wrap dfe-justify-content--space-between">
          <div className="dfe-flex-basis--70">
            <p
              className="govuk-!-margin-bottom-1"
              data-testid={`Team name for ${publication.title}`}
            >
              {contact?.teamName || 'No team name'}
            </p>
            {contact?.teamEmail && (
              <p className="govuk-!-margin-bottom-0">
                <a
                  href={`mailto:${contact.teamEmail}`}
                  data-testid={`Team email for ${publication.title}`}
                >
                  {contact.teamEmail}
                </a>
              </p>
            )}
          </div>
          {permissions.canUpdatePublication && (
            <div className="dfe-flex-basis--23-5 dfe-flex dfe-flex-direction--column  govuk-!-margin-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
              <ButtonLink
                data-testid={`Edit publication link for ${publication.title}`}
                className="govuk-!-margin-bottom-0  dfe-align--centre"
                variant="secondary"
                to={generatePath<PublicationRouteParams>(
                  publicationEditRoute.path,
                  {
                    publicationId: publication.id,
                  },
                )}
              >
                Manage publication
              </ButtonLink>
              <ButtonLink
                data-testid={`Edit publication link for ${publication.title}`}
                className="govuk-!-margin-bottom-0 govuk-!-margin-top-3 dfe-align--centre"
                to="/prototypes/manage-users"
                variant="secondary"
              >
                Manage team access
              </ButtonLink>
            </div>
          )}
        </div>
      </div>

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--top dfe-flex-underline govuk-!-padding-bottom-6 govuk-!-padding-top-3">
        <div className="dfe-flex-basis--20">
          <h5 className="govuk-!-margin-top-0">Contact</h5>
        </div>
        <div className="dfe-flex-basis--80 dfe-flex dfe-flex-wrap dfe-justify-content--space-between">
          <div className="dfe-flex-basis--70">
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
        </div>
      </div>

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--top dfe-flex-underline govuk-!-padding-bottom-6 govuk-!-padding-top-3">
        <div className="dfe-flex-basis--20">
          <h5 className="govuk-!-margin-top-0">Methodologies</h5>
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

      <div className="dfe-flex dfe-justify-content--space-between dfe-align-items--top govuk-!-padding-top-3 govuk-!-margin-bottom-9">
        <div className="dfe-flex-basis--20">
          <h5 className="govuk-!-margin-top-0">Releases</h5>
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
            <WarningMessage className="govuk-!-margin-bottom-2">
              No releases created
            </WarningMessage>
          )}
          <hr />
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
