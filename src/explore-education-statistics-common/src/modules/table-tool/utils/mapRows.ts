import { ExpandedHeader, Scope, TableCellJson } from './mapTableToJson';

function mapRows(
  rows: string[][],
  rowHeaders: ExpandedHeader[][],
): TableCellJson[][] {
  return rows.map((row, rowIndex) => {
    const rowsArray: TableCellJson[][] = [];

    // add the row header
    const y: TableCellJson[] = rowHeaders[rowIndex]?.map(header => {
      if (header.id === '') {
        return {
          rowSpan: header.span,
          colSpan: header.crossSpan,
          tag: 'td',
        };
      }
      return {
        rowSpan: header.span,
        colSpan: header.crossSpan,
        scope: header.isGroup ? 'rowgroup' : ('row' as Scope),
        text: header.text,
        tag: 'th',
      };
    });

    rowsArray.push(y);

    rowsArray.push(
      row.map(cell => {
        return {
          tag: 'td',
          text: cell,
        };
      }),
    );

    return rowsArray.flat();
  });
}
export default mapRows;
