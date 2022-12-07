import { ExpandedDataSet } from '@common/modules/charts/types/dataSet';
import {
  EMPTY_CELL_TEXT,
  TableCell,
} from '@common/modules/table-tool/components/TimePeriodDataTable';
import groupResultMeasuresByCombination from '@common/modules/table-tool/components/utils/groupResultMeasuresByCombination';
import Header from '@common/modules/table-tool/components/utils/Header';
import {
  CategoryFilter,
  Filter,
  Indicator,
  LocationFilter,
  TimePeriodFilter,
} from '@common/modules/table-tool/types/filters';
import { FullTableMeta } from '@common/modules/table-tool/types/fullTable';
import { TableHeadersConfig } from '@common/modules/table-tool/types/tableHeaders';
import { TableDataResult } from '@common/services/tableBuilderService';
import { PartialBy } from '@common/types';
import cartesian from '@common/utils/cartesian';
import sumBy from 'lodash/sumBy';
import addFilters from './addFilters';
import createExpandedColumnHeaders from './createExpandedColumnHeaders';
import createExpandedRowHeaders from './createExpandedRowHeaders';
import getCellText from './getCellText';
import getExcludedFilters from './getExcludedFilters';
import mapRows from './mapRows';
import optimizeFilters from './optimizeFilters';

export type Scope = 'colgroup' | 'col' | 'rowgroup' | 'row';

export interface ExpandedHeader {
  id: string;
  text: string;
  span: number;
  crossSpan: number;
  isGroup: boolean;
}

export interface TableCellJson {
  colSpan?: number;
  rowSpan?: number;
  scope?: Scope;
  tag: 'th' | 'td';
  text?: string;
}

export class FilterGroup extends Filter {
  constructor(label: string) {
    super({
      label,
      value: label,
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export function mapTableToJson(
  tableHeadersConfig: TableHeadersConfig,
  subjectMeta: FullTableMeta,
  results: TableDataResult[],
) {
  console.log('tableHeadersConfig', tableHeadersConfig);
  console.log('subjectMeta', subjectMeta);
  console.log('results', results);

  const rowHeadersCartesian = cartesian(
    ...tableHeadersConfig.rowGroups,
    tableHeadersConfig.rows as Filter[],
  );

  const columnHeadersCartesian = cartesian(
    ...tableHeadersConfig.columnGroups,
    tableHeadersConfig.columns as Filter[],
  );

  // Track which columns actually have text values
  // as we want to remove empty ones later.
  const columnsWithText = columnHeadersCartesian.map(() => false);

  const tableHeaderFilters = [
    ...tableHeadersConfig.columnGroups.flatMap(filterGroup => filterGroup),
    ...tableHeadersConfig.rowGroups.flatMap(filterGroup => filterGroup),
    ...tableHeadersConfig.columns,
    ...tableHeadersConfig.rows,
  ].map(filter => filter.id);

  const excludedFilters = getExcludedFilters(tableHeaderFilters, subjectMeta);

  // Group measures by their respective combination of filters
  // allowing lookups later on to be MUCH faster.
  const measuresByFilterCombination = groupResultMeasuresByCombination(
    results,
    excludedFilters,
  );

  const tableCartesian: TableCell[][] = rowHeadersCartesian.map(
    rowFilterCombination => {
      return columnHeadersCartesian.map(
        (columnFilterCombination, columnIndex) => {
          const filterCombination = [
            ...rowFilterCombination,
            ...columnFilterCombination,
          ];

          const dataSet = filterCombination.reduce<
            PartialBy<ExpandedDataSet, 'indicator'>
          >(
            (acc, filter) => {
              if (filter instanceof CategoryFilter) {
                acc.filters.push(filter);
              }

              if (filter instanceof TimePeriodFilter) {
                acc.timePeriod = filter;
              }

              if (filter instanceof LocationFilter) {
                acc.location = filter;
              }

              if (filter instanceof Indicator) {
                acc.indicator = filter;
              }

              return acc;
            },
            {
              filters: [],
            },
          );

          if (!dataSet.indicator) {
            throw new Error('No indicator for filter combination');
          }

          const text = getCellText(
            measuresByFilterCombination,
            dataSet as ExpandedDataSet,
          );

          // There is at least one cell in this
          // column that has a text value.
          if (text !== EMPTY_CELL_TEXT) {
            columnsWithText[columnIndex] = true;
          }

          return {
            text,
            rowFilters: rowFilterCombination,
            columnFilters: columnFilterCombination,
          };
        },
      );
    },
  );

  const filteredCartesian = tableCartesian
    .filter(row => row.some(cell => cell.text !== EMPTY_CELL_TEXT))
    .map(row => row.filter((_, index) => columnsWithText[index]));

  const rowHeaders = filteredCartesian.reduce<Header[]>((acc, row) => {
    // Only need to use first column's rowFilters
    // as they are the same for every column.
    const filters = optimizeFilters(row[0].rowFilters, [
      ...tableHeadersConfig.rowGroups,
      tableHeadersConfig.rows,
    ]);

    return addFilters(acc, filters);
  }, []);

  // Only need to use first row's columnFilters
  // as they are the same for every row.
  const columnHeaders = filteredCartesian[0].reduce<Header[]>((acc, column) => {
    const filters = optimizeFilters(column.columnFilters, [
      ...tableHeadersConfig.columnGroups,
      tableHeadersConfig.columns,
    ]);

    return addFilters(acc, filters);
  }, []);

  const rows = filteredCartesian.map(row => row.map(cell => cell.text));

  // We 'expand' our headers so that we create the real table
  // cells we need to render in array format (instead of a tree).
  const expandedColumnHeaders = createExpandedColumnHeaders(columnHeaders);
  const expandedRowHeaders = createExpandedRowHeaders(rowHeaders);

  const totalColumns = sumBy(expandedRowHeaders[0], header => header.crossSpan);

  // map table into json format

  const mappedColHeaders: TableCellJson[][] = expandedColumnHeaders.map(
    (columns, rowIndex) => {
      const row: TableCellJson[][] = [];
      // add a spacer td to the first header row
      if (rowIndex === 0) {
        row.push([
          {
            colSpan: totalColumns,
            rowSpan: expandedColumnHeaders.length,
            tag: 'td',
          },
        ]);
      }
      row.push(
        columns.map(col => {
          // Add an empty td instead of a th for empty group headers
          if (col.id === '') {
            return {
              colSpan: col.span,
              rowSpan: col.crossSpan,
              text: col.text,
              tag: 'td',
            };
          }
          return {
            colSpan: col.span,
            rowSpan: col.crossSpan,
            scope:
              rowIndex + col.crossSpan !== expandedColumnHeaders.length
                ? 'colgroup'
                : 'col',
            text: col.text,
            tag: 'th',
          };
        }),
      );

      return row.flat();
    },
  );

  const mappedRows = mapRows(rows, expandedRowHeaders);

  return {
    thead: mappedColHeaders,
    tbody: mappedRows,
    headerFilters: tableHeaderFilters,
  };
}
