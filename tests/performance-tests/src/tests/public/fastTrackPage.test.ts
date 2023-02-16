import { Counter, Rate, Trend } from 'k6/metrics';
import { Options } from 'k6/options';
import http, { RefinedResponse } from 'k6/http';
import { check, fail } from 'k6';
import getEnvironmentAndUsersFromFile from '../../utils/environmentAndUsers';
import loggingUtils from '../../utils/loggingUtils';

const fastTrackIds: string[] = [];

export const options: Options = {
  stages: [
    {
      duration: '0.1s',
      target: 80,
    },
    {
      duration: '10m',
      target: 80,
    },
  ],
  noConnectionReuse: true,
  insecureSkipTLSVerify: true,
};

export const errorRate = new Rate('ees_errors');

const environmentAndUsers = getEnvironmentAndUsersFromFile(
  __ENV.TEST_ENVIRONMENT as string,
);

export function setup() {
  loggingUtils.logDashboardUrls();
}

const performTest = () => {
  const startTime = Date.now();
  let response: RefinedResponse<undefined>;

  try {
    console.log('test');
  } catch (e) {
    // getReleaseFailureCount.add(1);
    errorRate.add(1);
    fail(`Failure to get permalink page - ${JSON.stringify(e)}`);
  }
};

export default performTest;
