import DownloadTable from '@common/modules/table-tool/components/DownloadTable';
import { FullTableMeta } from '@common/modules/table-tool/types/fullTable';
import {
  CategoryFilter,
  Indicator,
  LocationFilter,
  TimePeriodFilter,
} from '@common/modules/table-tool/types/filters';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { createRef } from 'react';
import { WorkBook, writeFile } from 'xlsx';

jest.mock('xlsx', () => {
  const { utils } = jest.requireActual('xlsx');

  return {
    writeFile: jest.fn(),
    utils,
  };
});

describe('DownloadTable', () => {
  const basicSubjectMeta: FullTableMeta = {
    geoJsonAvailable: false,
    publicationName: '',
    subjectName: 'The subject',
    footnotes: [],
    boundaryLevels: [],
    filters: {
      Characteristic: {
        name: 'characteristic',
        options: [
          new CategoryFilter({
            value: 'gender_female',
            label: 'Female',
            group: 'Gender',
            category: 'Characteristic',
          }),
        ],
      },
    },
    indicators: [
      new Indicator({
        label: 'Authorised absence rate',
        value: 'authAbsRate',
        unit: '%',
        name: 'sess_authorised_percent',
      }),
    ],
    locations: [
      new LocationFilter({
        value: 'england',
        label: 'England',
        level: 'country',
      }),
    ],
    timePeriodRange: [
      new TimePeriodFilter({
        code: 'AY',
        year: 2015,
        label: '2015/16',
        order: 0,
      }),
    ],
  };

  test('renders the form', () => {
    const ref = createRef<HTMLElement>();

    render(
      <DownloadTable
        fileName="The file name"
        fullTable={{
          subjectMeta: basicSubjectMeta,
          results: [],
        }}
        tableRef={ref}
      />,
    );
    expect(screen.getByText('Download Table')).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', {
        name: 'Table in ODS format (spreadsheet, with title and footnotes)',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', {
        name: 'Table in CSV format (flat file, with location codes)',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: 'Download table',
      }),
    ).toBeInTheDocument();
  });

  test('downloads the csv file', async () => {
    const ref = createRef<HTMLElement>();

    render(
      <DownloadTable
        fileName="The file name"
        fullTable={{
          subjectMeta: basicSubjectMeta,
          results: [],
        }}
        tableRef={ref}
      />,
    );
    fireEvent.click(
      screen.getByRole('radio', {
        name: 'Table in CSV format (flat file, with location codes)',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Download table',
      }),
    );

    const mockedWriteFile = writeFile as jest.Mock;
    await waitFor(() => {
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);

      const workbook = mockedWriteFile.mock.calls[0][0] as WorkBook;

      expect(workbook.Sheets.Sheet1.A1.v).toBe('location');
      expect(workbook.Sheets.Sheet1.B1.v).toBe('location_code');
      expect(workbook.Sheets.Sheet1.C1.v).toBe('geographic_level');
      expect(workbook.Sheets.Sheet1.D1.v).toBe('time_period');
      expect(workbook.Sheets.Sheet1.E1.v).toBe('characteristic');
      expect(workbook.Sheets.Sheet1.F1.v).toBe('sess_authorised_percent');

      expect(mockedWriteFile.mock.calls[0][1]).toBe('The file name.csv');
    });
  });

  test('downloads the ods file', async () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <table ref={ref}>
        <tr>
          <th />
          <th>Date 1</th>
          <th>Date 2</th>
        </tr>
        <tr>
          <th>Indicator</th>
          <td>101</td>
          <td>102</td>
        </tr>
      </table>,
    );
    render(
      <DownloadTable
        fileName="The file name"
        fullTable={{
          subjectMeta: basicSubjectMeta,
          results: [],
        }}
        tableRef={ref}
      />,
    );

    fireEvent.click(
      screen.getByRole('radio', {
        name: 'Table in ODS format (spreadsheet, with title and footnotes)',
      }),
    );
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Download table',
      }),
    );

    const mockedWriteFile = writeFile as jest.Mock;
    await waitFor(() => {
      expect(mockedWriteFile).toHaveBeenCalledTimes(1);

      const workbook = mockedWriteFile.mock.calls[0][0] as WorkBook;

      expect(workbook.Sheets.Sheet1.A1.v).toBe(
        "Table showing Authorised absence rate for 'The subject' for Female in England for 2015/16",
      );
      expect(workbook.Sheets.Sheet1.B3.v).toBe('Date 1');
      expect(workbook.Sheets.Sheet1.C3.v).toBe('Date 2');
      expect(workbook.Sheets.Sheet1.A4.v).toBe('Indicator');
      expect(workbook.Sheets.Sheet1.B4.v).toBe('101');
      expect(workbook.Sheets.Sheet1.C4.v).toBe('102');

      expect(mockedWriteFile.mock.calls[0][1]).toBe('The file name.ods');
    });
  });
});