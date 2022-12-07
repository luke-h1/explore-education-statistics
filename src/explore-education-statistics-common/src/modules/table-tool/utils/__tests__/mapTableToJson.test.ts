import { testChartTableData } from '@common/modules/charts/components/__tests__/__data__/testChartData';
import { TableDataResult } from '@common/services/tableBuilderService';
import { testTableHeadersConfig } from '../../components/__tests__/__data__/tableHeadersConfig.data';
import mapFullTable from '../mapFullTable';
import { mapTableToJson } from '../mapTableToJson';

const testResults: TableDataResult[] = [
  {
    filters: ['filter-1', 'filter-2'],
    geographicLevel: 'country',
    locationId: 'location-1',
    measures: {
      'indicator-1': '370',
    },
    timePeriod: '2006_AY',
  },
  {
    filters: ['filter-1', 'filter-2'],
    geographicLevel: 'country',
    locationId: 'location-1',
    measures: {
      'indicator-1': '5',
    },
    timePeriod: '2007_AY',
  },
  {
    filters: ['filter-1', 'filter-2'],
    geographicLevel: 'country',
    locationId: 'location-1',
    measures: {
      'indicator-1': '35',
    },
    timePeriod: '2008_AY',
  },
];

describe('mapTableToJson', () => {
  test('', () => {
    const testFullTableMeta = mapFullTable(testChartTableData);

    /* 
      1 filter, 1 indicator expect there to be x rows and x columns
    */

    /* 
      use an example locally
    */

    /* 
        multiheader table tests look at 
      */

    /* 
      merge results work
    */

    mapTableToJson(
      testTableHeadersConfig,
      testFullTableMeta.subjectMeta,
      testResults,
    );
  });
});
