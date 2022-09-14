import Client from '@common/services/api/Client';
import { commaSeparated } from '@common/services/util/paramSerializers';
import axios from 'axios';

const permalinkApi = new Client(
  axios.create({
    baseURL: 'http://localhost:3000/api/permalink', // env
    paramsSerializer: commaSeparated,
  }),
);

export default permalinkApi;
