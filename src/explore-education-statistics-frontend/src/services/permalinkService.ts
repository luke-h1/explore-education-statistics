import permalinkApi from '@frontend/services/clients/permalinkApi';
import { TableDataQuery } from '@common/services/tableBuilderService';
import { UnmappedTableHeadersConfig } from '@common/services/permalinkService';

interface Res {
  data: string;
}

interface Req {
  query: TableDataQuery;
  tableHeaders: UnmappedTableHeadersConfig;
}

export default {
  doStuff(tableData: Req): Promise<Res> {
    return permalinkApi.post('/', tableData);
  },
};
