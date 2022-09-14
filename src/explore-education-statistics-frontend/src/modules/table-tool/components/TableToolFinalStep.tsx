import Tag from '@common/components/Tag';
import useAsyncRetry from '@common/hooks/useAsyncRetry';
import useToggle from '@common/hooks/useToggle';
import DownloadTable, {
  FileFormat,
} from '@common/modules/table-tool/components/DownloadTable';
import TableHeadersForm from '@common/modules/table-tool/components/TableHeadersForm';
import TimePeriodDataTable from '@common/modules/table-tool/components/TimePeriodDataTable';
import TableToolShare from '@frontend/modules/table-tool/components/TableToolShare';
import TableToolInfo from '@common/modules/table-tool/components/TableToolInfo';
import { FullTable } from '@common/modules/table-tool/types/fullTable';
import { TableHeadersConfig } from '@common/modules/table-tool/types/tableHeaders';
import publicationService from '@common/services/publicationService';
import Link from '@frontend/components/Link';
import {
  SelectedPublication,
  TableDataQuery,
} from '@common/services/tableBuilderService';
import { logEvent } from '@frontend/services/googleAnalyticsService';
import React, { memo, ReactNode, useRef, useState } from 'react';
import Button from '@common/components/Button';
import permalinkService from '@frontend/services/permalinkService';
import mapUnmappedTableHeaders from '@common/modules/table-tool/utils/mapUnmappedTableHeaders';

interface TableToolFinalStepProps {
  query: TableDataQuery;
  table: FullTable;
  tableHeaders: TableHeadersConfig;
  selectedPublication: SelectedPublication;
  onReorderTableHeaders: (reorderedTableHeaders: TableHeadersConfig) => void;
}

const TableToolFinalStep = ({
  table,
  tableHeaders,
  query,
  selectedPublication,
  onReorderTableHeaders,
}: TableToolFinalStepProps) => {
  const dataTableRef = useRef<HTMLElement>(null);
  const [hasTableError, toggleHasTableError] = useToggle(false);

  const { value: fullPublication } = useAsyncRetry(
    async () =>
      publicationService.getLatestPublicationRelease(selectedPublication.slug),
    [selectedPublication],
  );
  const publication = fullPublication?.publication;

  const getMethodologyLinks = () => {
    const links: ReactNode[] =
      publication?.methodologies?.map(methodology => (
        <Link key={methodology.id} to={`/methodology/${methodology.slug}`}>
          {methodology.title}
        </Link>
      )) ?? [];

    if (publication?.externalMethodology) {
      links.push(
        <Link
          key={publication.externalMethodology.url}
          to={publication.externalMethodology.url}
        >
          {publication.externalMethodology.title}
        </Link>,
      );
    }
    return links;
  };

  // TEST
  // Gets the table string and render it. wouldn't actually
  // render it here, would use an id returned to for the
  // permalink url.
  const [testTable, setTestTable] = useState<string>();

  const handleGenerateTableString = async () => {
    // Unmapping the headers as the filter types aren't retained when the
    // table data is posted so need it to be more explicit which filter types they are.
    // These are then unmapped in the api to build the table.
    const unMappedTableHeaders = mapUnmappedTableHeaders(tableHeaders);
    const { data } = await permalinkService.doStuff({
      query,
      tableHeaders: unMappedTableHeaders,
    });
    setTestTable(data);
  };

  return (
    <div
      className="govuk-!-margin-bottom-4"
      data-testid="Table tool final step container"
    >
      {table && tableHeaders && (
        <>
          <div className="govuk-!-margin-bottom-3 dfe-flex dfe-align-items-start dfe-justify-content--space-between">
            {selectedPublication.selectedRelease.latestData && (
              <Tag strong>This is the latest data</Tag>
            )}

            {!selectedPublication.selectedRelease.latestData && (
              <>
                <div className="govuk-!-margin-bottom-3">
                  <Tag strong colour="orange">
                    This data is not from the latest release
                  </Tag>
                </div>

                <Link
                  className="dfe-print-hidden"
                  unvisited
                  to={`/find-statistics/${selectedPublication.slug}`}
                  testId="View latest data link"
                >
                  View latest data:{' '}
                  <span className="govuk-!-font-weight-bold">
                    {selectedPublication.latestRelease.title}
                  </span>
                </Link>
              </>
            )}
          </div>

          <TableHeadersForm
            initialValues={tableHeaders}
            onSubmit={nextTableHeaders => {
              onReorderTableHeaders(nextTableHeaders);
              if (dataTableRef.current) {
                // add a short delay so the reordering form is closed before it scrolls.
                setTimeout(() => {
                  dataTableRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }, 200);
              }
            }}
          />

          <TimePeriodDataTable
            ref={dataTableRef}
            fullTable={table}
            query={query}
            tableHeadersConfig={tableHeaders}
            onError={message => {
              toggleHasTableError.on();
              logEvent({
                category: 'Table Tool',
                action: 'Table rendering error',
                label: message,
              });
            }}
          />
        </>
      )}
      {!hasTableError && (
        <>
          <div className="govuk-!-margin-bottom-7">
            <TableToolShare
              tableHeaders={tableHeaders}
              query={query}
              selectedPublication={selectedPublication}
            />
          </div>

          <Button onClick={handleGenerateTableString}>Click me</Button>

          {testTable && <div dangerouslySetInnerHTML={{ __html: testTable }} />}

          <DownloadTable
            fullTable={table}
            fileName={`data-${selectedPublication.slug}`}
            tableRef={dataTableRef}
            onSubmit={(fileFormat: FileFormat) =>
              logEvent({
                category: 'Table tool',
                action:
                  fileFormat === 'csv'
                    ? 'CSV download button clicked'
                    : 'ODS download button clicked',
                label: `${table.subjectMeta.publicationName} between ${
                  table.subjectMeta.timePeriodRange[0].label
                } and ${
                  table.subjectMeta.timePeriodRange[
                    table.subjectMeta.timePeriodRange.length - 1
                  ].label
                }`,
              })
            }
          />
        </>
      )}

      <TableToolInfo
        contactDetails={publication?.contact}
        methodologyLinks={getMethodologyLinks()}
        releaseLink={
          <>
            {selectedPublication.selectedRelease.latestData ? (
              <Link to={`/find-statistics/${selectedPublication.slug}`}>
                {`${selectedPublication.title}, ${selectedPublication.selectedRelease.title}`}
              </Link>
            ) : (
              <Link
                to={`/find-statistics/${selectedPublication.slug}/${selectedPublication.selectedRelease.slug}`}
              >
                {`${selectedPublication.title}, ${selectedPublication.selectedRelease.title}`}
              </Link>
            )}
          </>
        }
      />
    </div>
  );
};

export default memo(TableToolFinalStep);
