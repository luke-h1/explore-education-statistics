import { BaseTimePeriodDataTable } from '@common/modules/table-tool/components/TimePeriodDataTable';
import mapTableHeadersConfig from '@common/modules/table-tool/utils/mapTableHeadersConfig';
import mapFullTable from '@common/modules/table-tool/utils/mapFullTable';
import tableBuilderService from '@common/services/tableBuilderService';
import type { NextApiRequest, NextApiResponse } from 'next';
import { renderToStaticMarkup } from 'react-dom/server';

interface Data {
  data?: string;
  error?: unknown;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method === 'POST') {
    try {
      const tableData = await tableBuilderService.getTableData(req.body.query);
      const table = mapFullTable(tableData);

      // re-map the headers to filters
      const tableHeadersConfig = mapTableHeadersConfig(
        req.body.tableHeaders,
        table,
      );

      // render the table component to a string.
      // I've split out BaseTimePeriodDataTable to use here as it doesn't work
      // with Exotic components (which I think relates to the forwarded ref on TimePeriodDataTable).
      const data = renderToStaticMarkup(
        BaseTimePeriodDataTable({
          fullTable: table,
          tableHeadersConfig,
        }),
      );
      if (data) {
        // Returning the table html string here, but would probably want to
        // send it to blob storage and return and id for retrieving it.
        res.status(200).send({ data });
      } else {
        res.status(500).send({ error: 'Cannot render table' });
      }
    } catch (error) {
      res.status(500).send({ error });
    }
  } else {
    res.status(400);
  }
}
