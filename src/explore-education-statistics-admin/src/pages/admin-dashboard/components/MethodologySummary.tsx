import ButtonLink from '@admin/components/ButtonLink';
import Link from '@admin/components/Link';
import {
  MethodologyRouteParams,
  methodologySummaryRoute,
} from '@admin/routes/methodologyRoutes';
import {
  externalMethodologyEditRoute,
  methodologyAdoptRoute,
} from '@admin/routes/routes';
import methodologyService from '@admin/services/methodologyService';
import publicationService, {
  MyPublication,
} from '@admin/services/publicationService';
import Button from '@common/components/Button';
import ButtonGroup from '@common/components/ButtonGroup';
import Details from '@common/components/Details';
import FormattedDate from '@common/components/FormattedDate';
import ModalConfirm from '@common/components/ModalConfirm';
import SummaryList from '@common/components/SummaryList';
import SummaryListItem from '@common/components/SummaryListItem';
import Tag from '@common/components/Tag';
import TagGroup from '@common/components/TagGroup';
import WarningMessage from '@common/components/WarningMessage';
import React, { useState } from 'react';
import { generatePath, useHistory } from 'react-router';
import classNames from 'classnames';

export interface Props {
  publication: MyPublication;
  topicId: string;
  onChangePublication: () => void;
}

const MethodologySummary = ({
  publication,
  topicId,
  onChangePublication,
}: Props) => {
  const history = useHistory();
  const [amendMethodologyId, setAmendMethodologyId] = useState<string>();
  const [deleteMethodologyDetails, setDeleteMethodologyDetails] = useState<{
    methodologyId: string;
    amendment: boolean;
  }>();
  const [dropMethodologyId, setDropMethodologyId] = useState<string>();

  const {
    contact,
    externalMethodology,
    methodologies,
    id: publicationId,
    title,
  } = publication;

  const handleRemoveExternalMethodology = async () => {
    const updatedPublication = {
      title,
      contact: {
        contactName: contact?.contactName ?? '',
        contactTelNo: contact?.contactTelNo ?? '',
        teamEmail: contact?.teamEmail ?? '',
        teamName: contact?.teamName ?? '',
      },
      topicId,
    };

    await publicationService.updatePublication(
      publicationId,
      updatedPublication,
    );
    onChangePublication();
  };

  const canCreateAdoptOrManageExternal =
    publication.permissions.canCreateMethodologies ||
    publication.permissions.canManageExternalMethodology ||
    publication.permissions.canAdoptMethodologies;

  return (
    <>
      {methodologies.map(publicationMethodologyLink => {
        const { owner, permissions, methodology } = publicationMethodologyLink;

        const canEdit =
          methodology.permissions.canApproveMethodology ||
          methodology.permissions.canMarkMethodologyAsDraft ||
          methodology.permissions.canUpdateMethodology;

        const displayTitle = owner
          ? `${methodology.title} (Owned)`
          : `${methodology.title} (Adopted)`;

        return (
          <Details
            key={methodology.id}
            open={false}
            className="govuk-!-margin-bottom-3"
            summary={displayTitle}
            summaryAfter={
              <TagGroup className="govuk-!-margin-left-2">
                <Tag>{methodology.status}</Tag>
                {methodology.amendment && <Tag>Amendment</Tag>}
              </TagGroup>
            }
          >
            <div className="dfe-flex">
              <div className="dfe-flex-basis--75">
                <SummaryList className="govuk-!-margin-bottom-3">
                  <SummaryListItem term="Publish date">
                    {methodology.published ? (
                      <FormattedDate>{methodology.published}</FormattedDate>
                    ) : (
                      'Not yet published'
                    )}
                  </SummaryListItem>
                  {methodology.latestInternalReleaseNote && (
                    <SummaryListItem term="Internal release note">
                      {methodology.latestInternalReleaseNote}
                    </SummaryListItem>
                  )}
                </SummaryList>
              </div>
              <div className="dfe-flex-basis--25">
                <div className="dfe-flex dfe-flex-direction--column dfe-justify-content--flex-end govuk-!-margin-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
                  {methodology.amendment ? (
                    <>
                      <ButtonLink
                        variant="secondary"
                        to={generatePath(methodologySummaryRoute.path, {
                          publicationId,
                          methodologyId: methodology.id,
                        })}
                      >
                        {canEdit ? 'Edit amendment' : 'View amendment'}
                      </ButtonLink>
                      <ButtonLink
                        to={generatePath(methodologySummaryRoute.path, {
                          publicationId,
                          methodologyId: methodology.previousVersionId,
                        })}
                        className="govuk-!-margin-left-4"
                        variant="secondary"
                      >
                        View original methodology
                      </ButtonLink>
                    </>
                  ) : (
                    <>
                      <Link
                        className="dfe-align--centre govuk-!-margin-bottom-6"
                        to={generatePath(methodologySummaryRoute.path, {
                          publicationId,
                          methodologyId: methodology.id,
                        })}
                      >
                        {canEdit ? 'Edit methodology' : 'View methodology'}
                      </Link>
                      {methodology.permissions
                        .canMakeAmendmentOfMethodology && (
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => setAmendMethodologyId(methodology.id)}
                        >
                          Amend methodology
                        </Button>
                      )}
                    </>
                  )}
                  {methodology.permissions.canDeleteMethodology && (
                    <Button
                      variant="warning"
                      onClick={() =>
                        setDeleteMethodologyDetails({
                          methodologyId: methodology.id,
                          amendment: methodology.amendment,
                        })
                      }
                    >
                      {methodology.amendment ? 'Cancel amendment' : 'Remove'}
                    </Button>
                  )}

                  {permissions.canDropMethodology && (
                    <Button
                      variant="warning"
                      onClick={() => {
                        setDropMethodologyId(methodology.methodologyId);
                      }}
                    >
                      Remove methodology
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Details>
        );
      })}

      {externalMethodology?.url && (
        <Details
          open={false}
          className="govuk-!-margin-bottom-4"
          summary={`${externalMethodology.title} (External)`}
        >
          <div className="dfe-flex">
            <div className="dfe-flex-basis--75">
              <SummaryList className="govuk-!-margin-bottom-3">
                <SummaryListItem term="URL">
                  <Link to={externalMethodology.url} unvisited>
                    {externalMethodology.url}
                  </Link>
                </SummaryListItem>
              </SummaryList>
            </div>
            <div className="dfe-flex-basis--25">
              <div className="dfe-flex dfe-flex-direction--column dfe-justify-content--flex-end govuk-!-margin-left-4 govuk-!-padding-left-4 dfe-flex-border--left">
                {publication.permissions.canManageExternalMethodology && (
                  <>
                    <Link
                      className="dfe-align--centre govuk-!-margin-bottom-6"
                      to={generatePath(externalMethodologyEditRoute.path, {
                        publicationId,
                      })}
                    >
                      Edit methodology
                    </Link>
                    <Button
                      type="button"
                      variant="warning"
                      onClick={handleRemoveExternalMethodology}
                    >
                      Remove methodology
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Details>
      )}

      {methodologies.length === 0 && !canCreateAdoptOrManageExternal && (
        <WarningMessage className="govuk-!-margin-bottom-2">
          No methodologies added
        </WarningMessage>
      )}

      {canCreateAdoptOrManageExternal && (
        <>
          {methodologies.length === 0 && !externalMethodology && (
            <>
              <WarningMessage className="govuk-!-margin-bottom-2">
                No methodologies added
              </WarningMessage>
              <hr />
            </>
          )}
          <ButtonGroup
            className={classNames(
              'govuk-!-margin-bottom-0',
              'dfe-justify-content--space-between',
              'dfe-flex-wrap',
              {
                'govuk-!-margin-top-6': methodologies.length > 0,
              },
            )}
          >
            {publication.permissions.canCreateMethodologies && (
              <Button
                className="govuk-!-margin-bottom-6"
                data-testid={`Create methodology for ${title}`}
                onClick={async () => {
                  const {
                    id: methodologyId,
                  } = await methodologyService.createMethodology(publicationId);
                  history.push(
                    generatePath<MethodologyRouteParams>(
                      methodologySummaryRoute.path,
                      {
                        methodologyId,
                      },
                    ),
                  );
                }}
              >
                Create methodology
              </Button>
            )}

            <div className="dfe-flex dfe-flex-wrap dfe-flex-basis--100">
              {publication.permissions.canManageExternalMethodology &&
                !externalMethodology && (
                  <>
                    <p className="govuk-!-margin-bottom-0 govuk-!-margin-right-3">
                      Or alternatively:{' '}
                    </p>
                    <Link
                      to={generatePath(externalMethodologyEditRoute.path, {
                        publicationId,
                      })}
                      className="govuk-!-margin-right-4"
                    >
                      Use external methodology
                    </Link>
                  </>
                )}

              {publication.permissions.canAdoptMethodologies && (
                <>
                  <p className="govuk-!-margin-bottom-0 govuk-!-margin-right-3">
                    or
                  </p>
                  <Link
                    to={generatePath(methodologyAdoptRoute.path, {
                      publicationId,
                    })}
                  >
                    Adopt a methodology
                  </Link>
                </>
              )}
            </div>
          </ButtonGroup>
        </>
      )}

      {amendMethodologyId && (
        <ModalConfirm
          open
          title="Confirm you want to amend this live methodology"
          onConfirm={async () => {
            const amendment = await methodologyService.createMethodologyAmendment(
              amendMethodologyId,
            );
            history.push(
              generatePath<MethodologyRouteParams>(
                methodologySummaryRoute.path,
                {
                  methodologyId: amendment.id,
                },
              ),
            );
          }}
          onExit={() => setAmendMethodologyId(undefined)}
          onCancel={() => setAmendMethodologyId(undefined)}
        >
          <p>
            Please note, any changes made to this live methodology must be
            approved before updates can be published.
          </p>
        </ModalConfirm>
      )}
      {deleteMethodologyDetails && (
        <ModalConfirm
          open
          title={
            deleteMethodologyDetails.amendment
              ? 'Confirm you want to cancel this amended methodology'
              : 'Confirm you want to remove this methodology'
          }
          onConfirm={async () => {
            await methodologyService.deleteMethodology(
              deleteMethodologyDetails?.methodologyId,
            );
            setDeleteMethodologyDetails(undefined);
            onChangePublication();
          }}
          onCancel={() => setDeleteMethodologyDetails(undefined)}
          onExit={() => setDeleteMethodologyDetails(undefined)}
        >
          <p>
            {deleteMethodologyDetails.amendment ? (
              <>
                By cancelling the amendments you will lose any changes made, and
                the original methodology will remain unchanged.
              </>
            ) : (
              <>By removing this methodology you will lose any changes made.</>
            )}
          </p>
        </ModalConfirm>
      )}
      {dropMethodologyId && (
        <ModalConfirm
          open
          title="Remove methodology"
          onConfirm={async () => {
            await publicationService.dropMethodology(
              publicationId,
              dropMethodologyId,
            );
            setDropMethodologyId(undefined);
            onChangePublication();
          }}
          onCancel={() => setDropMethodologyId(undefined)}
          onExit={() => setDropMethodologyId(undefined)}
        >
          <p>Are you sure you want to remove this adopted methodology?</p>
        </ModalConfirm>
      )}
    </>
  );
};

export default MethodologySummary;
