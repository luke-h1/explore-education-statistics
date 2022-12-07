import classNames from 'classnames';
import React, { createElement, forwardRef } from 'react';
import { TableCellJson } from '../utils/mapTableToJson';
import styles from './MultiHeaderTable.module.scss';

export interface MultiHeaderTableProps {
  ariaLabelledBy?: string;
  className?: string;
  tableJson: {
    thead: TableCellJson[][];
    tbody: TableCellJson[][];
  };
}

const MultiHeaderTable = forwardRef<HTMLTableElement, MultiHeaderTableProps>(
  ({ ariaLabelledBy, className, tableJson }, ref) => {
    return (
      <table
        data-testid={ariaLabelledBy && `${ariaLabelledBy}-table`}
        aria-labelledby={ariaLabelledBy}
        className={classNames('govuk-table', styles.table, className)}
        ref={ref}
      >
        <thead className={styles.tableHead}>
          {tableJson.thead.map((headerRow, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`headerRow-${index}`}>
              {headerRow.map(cell =>
                createElement(
                  cell.tag,
                  {
                    colSpan: cell.colSpan,
                    rowSpan: cell.rowSpan,
                    scope: cell.scope,
                    className: classNames({
                      [styles.emptyColumnHeaderCell]:
                        cell.tag === 'th' && !cell.text,
                    }),
                  },
                  cell.text,
                ),
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {tableJson.tbody.map((bodyRow, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={`bodyRow-${index}`}>
              {bodyRow.map((cell, i) => {
                return (
                  cell &&
                  createElement(
                    cell.tag,
                    {
                      key: `cell-${i}`,
                      colSpan: cell.colSpan,
                      rowSpan: cell.rowSpan,
                      scope: cell.scope,
                      className: classNames({
                        'govuk-table__cell--numeric': cell.tag === 'td',
                        [styles.emptyRowHeaderCell]:
                          cell.tag === 'th' && !cell.text,
                      }),
                    },
                    cell.text,
                  )
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
);

MultiHeaderTable.displayName = 'MultiHeaderTable';

export default MultiHeaderTable;
