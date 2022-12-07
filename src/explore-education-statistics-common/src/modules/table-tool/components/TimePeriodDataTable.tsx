import WarningMessage from '@common/components/WarningMessage';
import logger from '@common/services/logger';
import isErrorLike from '@common/utils/error/isErrorLike';
import { Filter } from '@common/modules/table-tool/types/filters';
import { FullTable } from '@common/modules/table-tool/types/fullTable';
import { TableHeadersConfig } from '@common/modules/table-tool/types/tableHeaders';
import { ReleaseTableDataQuery } from '@common/services/tableBuilderService';
import React, { forwardRef, memo } from 'react';
import DataTableCaption from './DataTableCaption';
import FixedMultiHeaderDataTable from './FixedMultiHeaderDataTable';
import { mapTableToJson } from '../utils/mapTableToJson';
import hasMissingRowsOrColumns from '../utils/hasMissingRowsOrColumns';

export const EMPTY_CELL_TEXT = 'no data';

export interface TableCell {
  text: string;
  rowFilters: Filter[];
  columnFilters: Filter[];
}

interface Props {
  captionTitle?: string;
  dataBlockId?: string;
  footnotesClassName?: string;
  fullTable: FullTable; // move out
  query?: ReleaseTableDataQuery;
  source?: string;
  tableHeadersConfig: TableHeadersConfig; // move out
  onError?: (message: string) => void;
}

const TimePeriodDataTable = forwardRef<HTMLElement, Props>(
  function TimePeriodDataTable(
    {
      captionTitle,
      dataBlockId,
      footnotesClassName,
      fullTable,
      query,
      source,
      tableHeadersConfig,
      onError,
    }: Props,
    dataTableRef,
  ) {
    try {
      const { subjectMeta, results } = fullTable;

      if (results.length === 0) {
        return (
          <WarningMessage>
            A table could not be returned. There is no data for the options
            selected.
          </WarningMessage>
        );
      }

      const { headerFilters, tbody, thead } = mapTableToJson(
        tableHeadersConfig,
        subjectMeta,
        results,
      );

      console.log('headerFilters', headerFilters);
      console.log('tbody', tbody);
      console.log('thead', thead);

      const captionId = dataBlockId
        ? `dataTableCaption-${dataBlockId}`
        : 'dataTableCaption';

      const showMissingRowsOrColumnsWarning =
        query && hasMissingRowsOrColumns(query, subjectMeta, headerFilters);

      return (
        <>
          {showMissingRowsOrColumnsWarning && (
            <WarningMessage>
              Some rows and columns are not shown in this table as the data does
              not exist in the underlying file.
            </WarningMessage>
          )}
          <FixedMultiHeaderDataTable
            caption={
              <DataTableCaption
                title={captionTitle}
                meta={subjectMeta}
                id={captionId}
              />
            }
            tableJson={{ thead, tbody }}
            captionId={captionId}
            footnotesClassName={footnotesClassName}
            footnotesId={
              dataBlockId
                ? `dataTableFootnotes-${dataBlockId}`
                : 'dataTableFootnotes'
            }
            ref={dataTableRef}
            footnotes={subjectMeta.footnotes}
            source={source}
            footnotesHeadingHiddenText={`for ${captionTitle}`}
          />
        </>
      );
    } catch (error) {
      logger.error(error);

      onError?.(isErrorLike(error) ? error.message : 'Unknown error');

      return (
        <WarningMessage testId="table-error">
          There was a problem rendering the table.
        </WarningMessage>
      );
    }
  },
);

TimePeriodDataTable.displayName = 'TimePeriodDataTable';

export default memo(TimePeriodDataTable);
