import { mapTableToJson } from '@common/modules/table-tool/utils/mapTableToJson';
import {
  testTableWithTwoLevelsOfRowAndColHeadersConfig,
  testTableWithTwoLevelsOfRowAndColHeaders,
  testTableWithThreeLevelsOfRowAndColHeadersConfig,
  testTableWithThreeLevelsOfRowAndColHeaders,
  testTableWithOneRowGroupHeaderSubGroup,
  testTableWithOneRowGroupHeaderSubGroupConfig,
} from '@common/modules/table-tool/utils/__data__/testTableData';

describe('mapTableToJson', () => {
  //  renders 2x2 table correctly
  test('returns the correct JSON for table with two levels of column headers and two levels of row headers', () => {
    const result = mapTableToJson(
      testTableWithTwoLevelsOfRowAndColHeadersConfig,
      testTableWithTwoLevelsOfRowAndColHeaders.subjectMeta,
      testTableWithTwoLevelsOfRowAndColHeaders.results,
    );

    // Header
    expect(result.thead).toHaveLength(2);
    // Header row 1
    expect(result.thead[0]).toHaveLength(3);
    expect(result.thead[0][0]).toEqual({ colSpan: 2, rowSpan: 2, tag: 'td' });
    expect(result.thead[0][1]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'LA 1',
    });
    expect(result.thead[0][2]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'LA 2',
    });
    // Header row 2
    expect(result.thead[1]).toHaveLength(4);
    expect(result.thead[1][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[1][1]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });
    expect(result.thead[1][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[1][3]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });

    // Body
    expect(result.tbody).toHaveLength(4);
    // Body row 1
    expect(result.tbody[0]).toHaveLength(6);
    expect(result.tbody[0][0]).toEqual({
      rowSpan: 2,
      colSpan: 1,
      scope: 'rowgroup',
      text: 'Category 2 Filter 1',
      tag: 'th',
    });
    expect(result.tbody[0][1]).toEqual({
      rowSpan: 1,
      colSpan: 1,
      scope: 'row',
      text: 'Indicator 1',
      tag: 'th',
    });
    expect(result.tbody[0][2].tag).toBe('td');
    expect(result.tbody[0][3].tag).toBe('td');
    expect(result.tbody[0][4].tag).toBe('td');
    expect(result.tbody[0][5].tag).toBe('td');

    // Body row 2
    expect(result.tbody[1]).toHaveLength(5);
    expect(result.tbody[1][0]).toEqual({
      rowSpan: 1,
      colSpan: 1,
      scope: 'row',
      text: 'Indicator 2',
      tag: 'th',
    });
    expect(result.tbody[1][1].tag).toBe('td');
    expect(result.tbody[1][2].tag).toBe('td');
    expect(result.tbody[1][3].tag).toBe('td');
    expect(result.tbody[1][4].tag).toBe('td');

    // Body row 3
    expect(result.tbody[2]).toHaveLength(6);
    expect(result.tbody[2][0]).toEqual({
      rowSpan: 2,
      colSpan: 1,
      scope: 'rowgroup',
      text: 'Category 2 Filter 2',
      tag: 'th',
    });
    expect(result.tbody[2][1]).toEqual({
      rowSpan: 1,
      colSpan: 1,
      scope: 'row',
      text: 'Indicator 1',
      tag: 'th',
    });
    expect(result.tbody[2][2].tag).toBe('td');
    expect(result.tbody[2][3].tag).toBe('td');
    expect(result.tbody[2][4].tag).toBe('td');
    expect(result.tbody[2][5].tag).toBe('td');

    // Body row 4
    expect(result.tbody[3]).toHaveLength(5);
    expect(result.tbody[3][0]).toEqual({
      rowSpan: 1,
      colSpan: 1,
      scope: 'row',
      text: 'Indicator 2',
      tag: 'th',
    });
    expect(result.tbody[3][1].tag).toBe('td');
    expect(result.tbody[3][2].tag).toBe('td');
    expect(result.tbody[3][3].tag).toBe('td');
    expect(result.tbody[3][4].tag).toBe('td');
  });

  //renders 2x2x2 table correctly
  test('returns the correct JSON for table with three levels of column headers and three levels of row headers', () => {
    const result = mapTableToJson(
      testTableWithThreeLevelsOfRowAndColHeadersConfig,
      testTableWithThreeLevelsOfRowAndColHeaders.subjectMeta,
      testTableWithThreeLevelsOfRowAndColHeaders.results,
    );

    // Header
    expect(result.thead).toHaveLength(3);
    // Header row 1
    expect(result.thead[0]).toHaveLength(3);
    expect(result.thead[0][0]).toEqual({ colSpan: 3, rowSpan: 3, tag: 'td' });
    expect(result.thead[0][1]).toEqual({
      colSpan: 4,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 2 Filter 1',
    });
    expect(result.thead[0][2]).toEqual({
      colSpan: 4,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 2 Filter 2',
    });

    // Header row 2
    expect(result.thead[1]).toHaveLength(4);
    expect(result.thead[1][0]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 1 Filter 2',
    });
    expect(result.thead[1][1]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 1 Filter 3',
    });
    expect(result.thead[1][2]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 1 Filter 2',
    });
    expect(result.thead[1][3]).toEqual({
      colSpan: 2,
      rowSpan: 1,
      scope: 'colgroup',
      tag: 'th',
      text: 'Category 1 Filter 3',
    });

    // Header row 3
    expect(result.thead[2]).toHaveLength(8);
    expect(result.thead[2][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[2][1]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });
    expect(result.thead[2][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[2][3]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });
    expect(result.thead[2][4]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[2][5]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });
    expect(result.thead[2][6]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.thead[2][7]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: '2013/14',
    });

    // Body
    expect(result.tbody).toHaveLength(8);
    // Body row 1
    expect(result.tbody[0]).toHaveLength(11);
    expect(result.tbody[0][0]).toEqual({
      colSpan: 1,
      rowSpan: 4,
      scope: 'rowgroup',
      tag: 'th',
      text: 'Region 1',
    });
    expect(result.tbody[0][1]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: 'LA 1',
    });
    expect(result.tbody[0][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 1',
    });
    expect(result.tbody[0][3].tag).toBe('td');
    expect(result.tbody[0][4].tag).toBe('td');
    expect(result.tbody[0][5].tag).toBe('td');
    expect(result.tbody[0][6].tag).toBe('td');
    expect(result.tbody[0][7].tag).toBe('td');
    expect(result.tbody[0][8].tag).toBe('td');
    expect(result.tbody[0][9].tag).toBe('td');
    expect(result.tbody[0][10].tag).toBe('td');

    // Body row 2
    expect(result.tbody[1]).toHaveLength(9);
    expect(result.tbody[1][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 2',
    });
    expect(result.tbody[1][1].tag).toBe('td');
    expect(result.tbody[1][2].tag).toBe('td');
    expect(result.tbody[1][3].tag).toBe('td');
    expect(result.tbody[1][4].tag).toBe('td');
    expect(result.tbody[1][5].tag).toBe('td');
    expect(result.tbody[1][6].tag).toBe('td');
    expect(result.tbody[1][7].tag).toBe('td');
    expect(result.tbody[1][8].tag).toBe('td');

    // Body row 3
    expect(result.tbody[2]).toHaveLength(10);
    expect(result.tbody[2][0]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: 'LA 2',
    });
    expect(result.tbody[2][1]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 1',
    });
    expect(result.tbody[2][2].tag).toBe('td');
    expect(result.tbody[2][3].tag).toBe('td');
    expect(result.tbody[2][4].tag).toBe('td');
    expect(result.tbody[2][5].tag).toBe('td');
    expect(result.tbody[2][6].tag).toBe('td');
    expect(result.tbody[2][7].tag).toBe('td');
    expect(result.tbody[2][8].tag).toBe('td');
    expect(result.tbody[2][9].tag).toBe('td');

    // Body row 4
    expect(result.tbody[3]).toHaveLength(9);
    expect(result.tbody[3][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 2',
    });
    expect(result.tbody[3][1].tag).toBe('td');
    expect(result.tbody[3][2].tag).toBe('td');
    expect(result.tbody[3][3].tag).toBe('td');
    expect(result.tbody[3][4].tag).toBe('td');
    expect(result.tbody[3][5].tag).toBe('td');
    expect(result.tbody[3][6].tag).toBe('td');
    expect(result.tbody[3][7].tag).toBe('td');
    expect(result.tbody[3][8].tag).toBe('td');

    // Body row 5
    expect(result.tbody[4]).toHaveLength(11);
    expect(result.tbody[4][0]).toEqual({
      colSpan: 1,
      rowSpan: 4,
      scope: 'rowgroup',
      tag: 'th',
      text: 'Region 2',
    });
    expect(result.tbody[4][1]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: 'LA 3',
    });
    expect(result.tbody[4][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 1',
    });
    expect(result.tbody[4][3].tag).toBe('td');
    expect(result.tbody[4][4].tag).toBe('td');
    expect(result.tbody[4][5].tag).toBe('td');
    expect(result.tbody[4][6].tag).toBe('td');
    expect(result.tbody[4][7].tag).toBe('td');
    expect(result.tbody[4][8].tag).toBe('td');
    expect(result.tbody[4][9].tag).toBe('td');
    expect(result.tbody[4][10].tag).toBe('td');

    // Body row 6
    expect(result.tbody[5]).toHaveLength(9);
    expect(result.tbody[5][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 2',
    });
    expect(result.tbody[5][1].tag).toBe('td');
    expect(result.tbody[5][2].tag).toBe('td');
    expect(result.tbody[5][3].tag).toBe('td');
    expect(result.tbody[5][4].tag).toBe('td');
    expect(result.tbody[5][5].tag).toBe('td');
    expect(result.tbody[5][6].tag).toBe('td');
    expect(result.tbody[5][7].tag).toBe('td');
    expect(result.tbody[5][8].tag).toBe('td');

    // Body row 7
    expect(result.tbody[6]).toHaveLength(10);
    expect(result.tbody[6][0]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: 'LA 4',
    });
    expect(result.tbody[6][1]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 1',
    });
    expect(result.tbody[6][2].tag).toBe('td');
    expect(result.tbody[6][3].tag).toBe('td');
    expect(result.tbody[6][4].tag).toBe('td');
    expect(result.tbody[6][5].tag).toBe('td');
    expect(result.tbody[6][6].tag).toBe('td');
    expect(result.tbody[6][7].tag).toBe('td');
    expect(result.tbody[6][8].tag).toBe('td');
    expect(result.tbody[6][9].tag).toBe('td');

    // Body row 8
    expect(result.tbody[7]).toHaveLength(9);
    expect(result.tbody[7][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Indicator 2',
    });
    expect(result.tbody[7][1].tag).toBe('td');
    expect(result.tbody[7][2].tag).toBe('td');
    expect(result.tbody[7][3].tag).toBe('td');
    expect(result.tbody[7][4].tag).toBe('td');
    expect(result.tbody[7][5].tag).toBe('td');
    expect(result.tbody[7][6].tag).toBe('td');
    expect(result.tbody[7][7].tag).toBe('td');
    expect(result.tbody[7][8].tag).toBe('td');
  });

  test('renders table with one `rowgroup` header subgroup', () => {
    const result = mapTableToJson(
      testTableWithOneRowGroupHeaderSubGroupConfig,
      testTableWithOneRowGroupHeaderSubGroup.subjectMeta,
      testTableWithOneRowGroupHeaderSubGroup.results,
    );

    // Header
    expect(result.thead).toHaveLength(1);
    // Header row 1
    expect(result.thead[0]).toHaveLength(3);
    expect(result.thead[0][0]).toEqual({ colSpan: 3, rowSpan: 1, tag: 'td' });
    expect(result.thead[0][1]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: 'LA 1',
    });
    expect(result.thead[0][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'col',
      tag: 'th',
      text: 'LA 2',
    });

    // Body
    expect(result.tbody).toHaveLength(2);
    // Body row 1
    expect(result.tbody[0]).toHaveLength(5);
    expect(result.tbody[0][0]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: 'Indicator 1',
    });
    expect(result.tbody[0][1]).toEqual({
      colSpan: 1,
      rowSpan: 2,
      scope: 'rowgroup',
      tag: 'th',
      text: '2012/13',
    });
    expect(result.tbody[0][2]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Category 2 Filter 1',
    });
    expect(result.tbody[0][3].tag).toBe('td');
    expect(result.tbody[0][4].tag).toBe('td');

    // Body row 2
    expect(result.tbody[1]).toHaveLength(3);
    expect(result.tbody[1][0]).toEqual({
      colSpan: 1,
      rowSpan: 1,
      scope: 'row',
      tag: 'th',
      text: 'Category 2 Filter 2',
    });
    expect(result.tbody[1][1].tag).toBe('td');
    expect(result.tbody[1][2].tag).toBe('td');
  });
});
