import { mapTableToJson } from '@common/modules/table-tool/utils/mapTableToJson';
import {
  testTableWithTwoLevelsOfRowAndColHeadersConfig,
  testTableWithTwoLevelsOfRowAndColHeaders,
  testTableWithThreeLevelsOfRowAndColHeadersConfig,
  testTableWithThreeLevelsOfRowAndColHeaders,
  testTableWithOneRowGroupHeaderSubGroup,
  testTableWithOneRowGroupHeaderSubGroupConfig,
} from '@common/modules/table-tool/utils/__data__/testTableData';
import MultiHeaderTable from '@common/modules/table-tool/components/MultiHeaderTable';
import { render } from '@testing-library/react';
import React from 'react';

describe('MultiHeaderTable', () => {
  // renders 2x2 table correctly
  test('renders a table with two levels of column headers and two levels of row headers correctly', () => {
    const { container } = render(
      <MultiHeaderTable
        tableJson={mapTableToJson(
          testTableWithTwoLevelsOfRowAndColHeadersConfig,
          testTableWithTwoLevelsOfRowAndColHeaders.subjectMeta,
          testTableWithTwoLevelsOfRowAndColHeaders.results,
        )}
      />,
    );

    expect(container.querySelectorAll('thead tr')).toHaveLength(2);
    expect(
      container.querySelectorAll('thead tr:nth-child(1) th[scope="colgroup"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('thead tr:nth-child(2) th[scope="col"]'),
    ).toHaveLength(4);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(4);
    expect(container.querySelectorAll('tbody tr:nth-child(1) td')).toHaveLength(
      4,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(2) td')).toHaveLength(
      4,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(3) td')).toHaveLength(
      4,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(4) td')).toHaveLength(
      4,
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  // renders 2x2x2 table correctly
  test('renders a table with three levels of column headers and two levels of row headers correctly', () => {
    const { container } = render(
      <MultiHeaderTable
        tableJson={mapTableToJson(
          testTableWithThreeLevelsOfRowAndColHeadersConfig,
          testTableWithThreeLevelsOfRowAndColHeaders.subjectMeta,
          testTableWithThreeLevelsOfRowAndColHeaders.results,
        )}
      />,
    );

    expect(container.querySelectorAll('thead tr')).toHaveLength(3);
    expect(
      container.querySelectorAll('thead tr:nth-child(1) th[scope="colgroup"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('thead tr:nth-child(2) th[scope="colgroup"]'),
    ).toHaveLength(4);
    expect(
      container.querySelectorAll('thead tr:nth-child(3) th[scope="col"]'),
    ).toHaveLength(8);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(8);
    expect(container.querySelectorAll('tbody tr:nth-child(1) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(2) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(3) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(4) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(5) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(6) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(7) td')).toHaveLength(
      8,
    );
    expect(container.querySelectorAll('tbody tr:nth-child(8) td')).toHaveLength(
      8,
    );

    expect(container.innerHTML).toMatchSnapshot();
  });

  test('renders table with one `rowgroup` header subgroup', () => {
    const { container } = render(
      <MultiHeaderTable
        tableJson={mapTableToJson(
          testTableWithOneRowGroupHeaderSubGroupConfig,
          testTableWithOneRowGroupHeaderSubGroup.subjectMeta,
          testTableWithOneRowGroupHeaderSubGroup.results,
        )}
      />,
    );

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(container.querySelectorAll('tbody td')).toHaveLength(4);

    // Row 1
    const row1Headers = container.querySelectorAll('tbody tr:nth-child(1) th');
    expect(row1Headers).toHaveLength(3);

    expect(row1Headers[0]).toHaveTextContent('Indicator 1');
    expect(row1Headers[0]).toHaveAttribute('scope', 'rowgroup');
    expect(row1Headers[0]).toHaveAttribute('rowspan', '2');

    expect(row1Headers[1]).toHaveTextContent('2012/13');
    expect(row1Headers[1]).toHaveAttribute('scope', 'rowgroup');
    expect(row1Headers[1]).toHaveAttribute('rowspan', '2');

    expect(row1Headers[2]).toHaveTextContent('Category 2 Filter 1');
    expect(row1Headers[2]).toHaveAttribute('scope', 'row');
    expect(row1Headers[2]).toHaveAttribute('rowspan', '1');

    // Row 2
    const row2Headers = container.querySelectorAll('tbody tr:nth-child(2) th');
    expect(row2Headers).toHaveLength(1);

    expect(row2Headers[0]).toHaveTextContent('Category 2 Filter 2');
    expect(row2Headers[0]).toHaveAttribute('scope', 'row');
    expect(row2Headers[0]).toHaveAttribute('rowspan', '1');

    expect(container.innerHTML).toMatchSnapshot();
  });
});
