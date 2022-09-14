import FormattedDate from '@common/components/FormattedDate';
import WarningMessage from '@common/components/WarningMessage';
import useToggle from '@common/hooks/useToggle';
import DownloadTable, {
  FileFormat,
} from '@common/modules/table-tool/components/DownloadTable';
// import TimePeriodDataTable from '@common/modules/table-tool/components/TimePeriodDataTable';
import mapFullTable from '@common/modules/table-tool/utils/mapFullTable';
import mapTableHeadersConfig from '@common/modules/table-tool/utils/mapTableHeadersConfig';
import permalinkService, { Permalink } from '@common/services/permalinkService';
import ButtonLink from '@frontend/components/ButtonLink';
import Page from '@frontend/components/Page';
import PrintThisPage from '@frontend/components/PrintThisPage';
import styles from '@frontend/modules/permalink/PermalinkPage.module.scss';
import { logEvent } from '@frontend/services/googleAnalyticsService';
import { GetServerSideProps, NextPage } from 'next';
import React, { useRef } from 'react';

// Example table html as a string
const tableString =
  '<figure class="dfe-table-tool-figure"><figcaption><strong id="dataTableCaption" data-testid="dataTableCaption">&#x27;1&#x27; in Barnsley, Birmingham, Camden and Greenwich between 2020/21 and 2022/23</strong></figcaption><div tabindex="0" class="dfe-table-tool-container FixedMultiHeaderDataTable_container__1Baop" role="region"><table data-testid="dataTableCaption-table" aria-labelledby="dataTableCaption" class="govuk-table dfe-table-tool-table"><thead class="dfe-table-tool-tableHead"><tr><td colSpan="2" rowspan="1" class="dfe-table-tool-borderBottom"></td><th colSpan="1" rowspan="1" scope="col">2020/21</th><th colSpan="1" rowspan="1" scope="col">2021/22</th><th colSpan="1" rowspan="1" scope="col">2022/23</th></tr></thead><tbody><tr><th class="dfe-table-tool-borderBottom" rowspan="2" colSpan="1" scope="rowgroup">Barnsley</th><th class="" rowspan="1" colSpan="1" scope="row">Indicator one</th><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">1</td><td class="govuk-table__cell--numeric">no data</td></tr><tr><th class="" rowspan="1" colSpan="1" scope="row">Indicator two</th><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">2</td><td class="govuk-table__cell--numeric">no data</td></tr><tr><th class="dfe-table-tool-borderBottom" rowspan="2" colSpan="1" scope="rowgroup">Birmingham</th><th class="" rowspan="1" colSpan="1" scope="row">Indicator one</th><td class="govuk-table__cell--numeric">1</td><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">no data</td></tr><tr><th class="" rowspan="1" colSpan="1" scope="row">Indicator two</th><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">2</td><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">no data</td><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">no data</td></tr><tr><th class="dfe-table-tool-borderBottom" rowspan="2" colSpan="1" scope="rowgroup">Camden</th><th class="" rowspan="1" colSpan="1" scope="row">Indicator one</th><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">2</td></tr><tr><th class="" rowspan="1" colSpan="1" scope="row">Indicator two</th><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">2</td></tr><tr><th class="dfe-table-tool-borderBottom" rowspan="2" colSpan="1" scope="rowgroup">Greenwich</th><th class="" rowspan="1" colSpan="1" scope="row">Indicator one</th><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">no data</td><td class="govuk-table__cell--numeric">1</td></tr><tr><th class="" rowspan="1" colSpan="1" scope="row">Indicator two</th><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">no data</td><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">no data</td><td class="govuk-table__cell--numeric dfe-table-tool-borderBottom">2</td></tr></tbody></table></div><h3 class="govuk-heading-m">Footnotes</h3><ol class="govuk-list CollapsibleList_listContainer__2sdMZ govuk-list--number" data-testid="footnotes"><li>ewdwed</li></ol></figure>';
interface Props {
  data: Permalink;
}

const PermalinkPage: NextPage<Props> = ({ data }) => {
  const [hasTableError, toggleHasTableError] = useToggle(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const fullTable = mapFullTable(data.fullTable);
  const tableHeadersConfig = mapTableHeadersConfig(
    data.configuration.tableHeaders,
    fullTable,
  );

  const { subjectName, publicationName } = fullTable.subjectMeta;

  return (
    <Page
      title={`'${subjectName}' from '${publicationName}'`}
      caption="Permanent data table"
      className={styles.permalinkPage}
      wide
      breadcrumbs={[
        { name: 'Data tables', link: '/data-tables' },
        { name: 'Permanent link', link: '/data-tables' },
      ]}
    >
      <div className="dfe-flex dfe-justify-content--space-between">
        <dl className="dfe-meta-content">
          <dt className="govuk-caption-m">Created: </dt>
          <dd data-testid="created-date">
            <strong>
              <FormattedDate>{data.created}</FormattedDate>
            </strong>
          </dd>
        </dl>

        <PrintThisPage
          onClick={() =>
            logEvent({
              category: 'Page print',
              action: 'Print this page link selected',
              label: window.location.pathname,
            })
          }
        />
      </div>

      {data.status === 'SubjectRemoved' && (
        <WarningMessage error>
          WARNING - The data used in this table is no longer valid.
        </WarningMessage>
      )}
      {(data.status === 'NotForLatestRelease' ||
        data.status === 'PublicationSuperseded') && (
        <WarningMessage error>
          WARNING - The data used in this table may now be out-of-date as a new
          release has been published since its creation.
        </WarningMessage>
      )}
      {data.status === 'SubjectReplacedOrRemoved' && (
        <WarningMessage error>
          WARNING - The data used in this table may be invalid as the subject
          file has been amended or removed since its creation.
        </WarningMessage>
      )}

      <div ref={tableRef}>
        <div dangerouslySetInnerHTML={{ __html: tableString }} />
        {/* <TimePeriodDataTable
          fullTable={fullTable}
          source={`${publicationName}, ${subjectName}`}
          tableHeadersConfig={tableHeadersConfig}
          onError={message => {
            toggleHasTableError.on();
            logEvent({
              category: 'Permalink page',
              action: 'Table rendering error',
              label: message,
            });
          }}
        /> */}
      </div>

      <div className={styles.hidePrint}>
        {!hasTableError && (
          <DownloadTable
            fullTable={fullTable}
            fileName={`permalink-${data.id}`}
            headingSize="m"
            headingTag="h2"
            tableRef={tableRef}
            onSubmit={(fileFormat: FileFormat) =>
              logEvent({
                category: 'Permalink page',
                action:
                  fileFormat === 'csv'
                    ? 'CSV download button clicked'
                    : 'ODS download button clicked',
                label: `${fullTable.subjectMeta.publicationName} between ${
                  fullTable.subjectMeta.timePeriodRange[0].label
                } and ${
                  fullTable.subjectMeta.timePeriodRange[
                    fullTable.subjectMeta.timePeriodRange.length - 1
                  ].label
                }`,
              })
            }
          />
        )}

        <h2 className="govuk-heading-m govuk-!-margin-top-9">
          Create your own tables
        </h2>
        <p>
          Use our tool to build tables using our range of national and regional
          data.
        </p>
        <ButtonLink to="/data-tables">Create tables</ButtonLink>
      </div>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { permalink } = query;
  const data = await permalinkService.getPermalink(permalink as string);

  return {
    props: {
      data,
    },
  };
};

export default PermalinkPage;
