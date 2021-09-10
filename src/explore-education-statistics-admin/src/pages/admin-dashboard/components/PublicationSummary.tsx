import ButtonLink from '@admin/components/ButtonLink';
import Link from '@admin/components/Link';
import {
  ReleaseRouteParams,
  releaseSummaryRoute,
} from '@admin/routes/releaseRoutes';
import {
  publicationEditRoute,
  PublicationRouteParams,
  releaseCreateRoute,
} from '@admin/routes/routes';
import { MyPublication } from '@admin/services/publicationService';
import releaseService, { Release } from '@admin/services/releaseService';
import ButtonGroup from '@common/components/ButtonGroup';
import ModalConfirm from '@common/components/ModalConfirm';
import React, { useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import CancelAmendmentModal from './CancelAmendmentModal';
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
  const history = useHistory();

  const [amendReleaseId, setAmendReleaseId] = useState<string>();
  const [cancelAmendmentReleaseId, setCancelAmendmentReleaseId] = useState<
    string
  >();

  const { contact, permissions, releases, id, title } = publication;

  const noAmendmentInProgressFilter = (release: Release) =>
    !releases.some(r => r.amendment && r.previousVersionId === release.id);
  return (
    <>
      <div className="dfe-flex govuk-!-margin-bottom-9">
        <h4 className="govuk-!-width-one-quarter">Publication team and contact</h4>
        <div className="govuk-!-width-one-half">
          <p data-testid={`Team name for ${publication.title}`} className="govuk-!-margin-bottom-0">
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
          <p data-testid={`Contact name for ${publication.title}`} className="govuk-!-margin-bottom-0">
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
        {permissions.canUpdatePublication && (
          <div className="dfe-align-item--right">
            <ButtonLink
              variant="secondary"
              data-testid={`Edit publication link for ${publication.title}`}
              to={generatePath<PublicationRouteParams>(
                publicationEditRoute.path,
                {
                  publicationId: publication.id,
                },
              )}
            >
              Manage this publication
            </ButtonLink>
          </div>
        )}
      </div>
      <div className="dfe-flex govuk-!-margin-bottom-9">
        <h4 className="govuk-!-width-one-quarter">Methodologies</h4>
        <div className="govuk-!-width-three-quarters">
          <MethodologySummary
            publication={publication}
            topicId={topicId}
            onChangePublication={onChangePublication}
          />
        </div>
      </div>
      <div className="dfe-flex govuk-!-margin-bottom-6">
        <h4 className="govuk-!-width-one-quarter">
          Releases
        </h4>
        <div className="govuk-!-width-three-quarters">
          {releases.length > 0 ? (
            <ul className="govuk-list">
              {releases.filter(noAmendmentInProgressFilter).map(release => (
                <li key={release.id}>
                  <NonScheduledReleaseSummary
                    onClickAmendRelease={setAmendReleaseId}
                    onClickCancelAmendment={setCancelAmendmentReleaseId}
                    release={release}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <strong>No releases created</strong>
          )}
          <ButtonGroup className="govuk-!-margin-top-9">
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
    
      {amendReleaseId && (
        <ModalConfirm
          title="Confirm you want to amend this live release"
          onConfirm={async () => {
            const amendment = await releaseService.createReleaseAmendment(
              amendReleaseId,
            );

            history.push(
              generatePath<ReleaseRouteParams>(releaseSummaryRoute.path, {
                publicationId: id,
                releaseId: amendment.id,
              }),
            );
          }}
          onExit={() => setAmendReleaseId(undefined)}
          onCancel={() => setAmendReleaseId(undefined)}
          open
        >
          <p>
            Please note, any changes made to this live release must be approved
            before updates can be published.
          </p>
        </ModalConfirm>
      )}

      {cancelAmendmentReleaseId && (
        <CancelAmendmentModal
          onConfirm={async () => {
            await releaseService.deleteRelease(cancelAmendmentReleaseId);
            setCancelAmendmentReleaseId(undefined);
            onChangePublication();
          }}
          onCancel={() => setCancelAmendmentReleaseId(undefined)}
        />
      )}
    </>
  );
};

export default PublicationSummary;
