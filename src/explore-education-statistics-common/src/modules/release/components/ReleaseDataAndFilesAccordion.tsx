import Accordion from '@common/components/Accordion';
import AccordionSection from '@common/components/AccordionSection';
import Details from '@common/components/Details';
import { Release } from '@common/services/publicationService';
import { FileInfo } from '@common/services/types/file';
import { zip } from 'lodash';
// import classNames from 'classnames';
import orderBy from 'lodash/orderBy';
import React, { ReactNode } from 'react';
import styles from './ReleaseDataAndFilesAccordion.module.scss';

interface Props {
  release: Release;
  renderAllFilesButton?: ReactNode;
  renderCreateTablesButton?: ReactNode;
  renderDataCatalogueLink?: ReactNode;
  renderDownloadLink: (file: FileInfo) => ReactNode;
  renderDataGuidanceLink: ReactNode;
  renderPreReleaseAccessLink?: ReactNode;
  onSectionOpen?: (accordionSection: { id: string; title: string }) => void;
}

const ReleaseDataAndFilesAccordion = ({
  release,
  renderAllFilesButton,
  renderCreateTablesButton,
  renderDataCatalogueLink,
  renderDownloadLink,
  renderDataGuidanceLink,
  renderPreReleaseAccessLink,
  onSectionOpen,
}: Props) => {
  const dataFiles = orderBy(
    release.downloadFiles.filter(file => file.type === 'Data'),
    ['name'],
  );

  const ancillaryFiles = orderBy(
    release.downloadFiles.filter(
      file => file.type === 'Ancillary' && file.name !== 'All files',
    ),
    ['name'],
  );

  const hasAllFilesButton =
    (dataFiles.length > 0 || ancillaryFiles.length > 0) && renderAllFilesButton;

  return (
    <div className={styles.container}>
      <Accordion
        id="dataDownloads"
        showOpenAll={false}
        onSectionOpen={accordionSection => {
          if (onSectionOpen) {
            onSectionOpen(accordionSection);
          }
        }}
      >
        <AccordionSection heading="Explore data and files">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-three-quarters">
              <p>
                All data used in this release is available as open data for
                download.
              </p>
            </div>

            {hasAllFilesButton && (
              <div className="govuk-grid-column-one-quarter dfe-align--centre">
                {renderAllFilesButton}
              </div>
            )}
          </div>
          <hr className="govuk-!-margin-top-3" />

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              <h3 className="govuk-heading-s govuk-!-margin-bottom-0">
                Open data
              </h3>
              <p>
                The open data files contain all data used in this release in a
                machine readable format.
              </p>

              {!renderDataCatalogueLink && dataFiles.length > 0 && (
                <ul className="govuk-list" data-testid="data-files">
                  {dataFiles.map(file => (
                    <li key={file.id}>
                      {renderDownloadLink(file)}
                      {` (${file.extension}, ${file.size})`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {renderDataCatalogueLink && (
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-three-quarters">
                <p>
                  Browse and download individual open data files from this
                  release in our data catalogue.
                </p>
              </div>
              <div className="govuk-grid-column-one-quarter dfe-align--centre">
                {renderDataCatalogueLink}
              </div>
            </div>
          )}

          {release.hasDataGuidance && (
            <>
              <hr />
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-three-quarters">
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">
                    Guidance
                  </h3>
                  <p>
                    Learn more about the data files used in this release using
                    our online guidance.
                  </p>
                </div>
                <div className="govuk-grid-column-one-quarter dfe-align--centre govuk-!-margin-top-1">
                  {renderDataGuidanceLink}
                </div>
              </div>
            </>
          )}

          {renderCreateTablesButton && (
            <>
              <hr className="govuk-!-margin-top-0" />
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-three-quarters">
                  <h3 className="govuk-heading-s govuk-!-margin-bottom-0">
                    Create your own tables
                  </h3>
                  <p>
                    You can view featured tables that we have built for you, or
                    create your own tables from the open data using our table
                    tool.
                  </p>
                </div>
                <div className="govuk-grid-column-one-quarter govuk-!-margin-top-1">
                  {renderCreateTablesButton}
                </div>
              </div>
            </>
          )}

          {ancillaryFiles.length > 0 && (
            <>
              <hr />
              <h3 className="govuk-heading-s govuk-!-margin-bottom-0">
                All supporting files
              </h3>
              <p>
                All supporting files from this release are listed for individual
                download below:
              </p>

              <Details summary="List of all supporting files">
                <ul className="govuk-list" data-testid="other-files">
                  {ancillaryFiles.map(file => (
                    <li key={file.id}>
                      {renderDownloadLink(file)}
                      {` (${file.extension}, ${file.size})`}

                      {file.summary && (
                        <Details
                          summary="More details"
                          className="govuk-!-margin-top-2"
                        >
                          <div className="dfe-white-space--pre-wrap">
                            {file.summary}
                          </div>
                        </Details>
                      )}
                    </li>
                  ))}
                </ul>
              </Details>
            </>
          )}
          {release.hasPreReleaseAccessList && renderPreReleaseAccessLink && (
            <>
              <h3>Pre-release access list</h3>
              <p>{renderPreReleaseAccessLink}</p>
            </>
          )}
        </AccordionSection>
      </Accordion>
    </div>
  );
};

export default ReleaseDataAndFilesAccordion;
