#!/usr/bin/env node
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';

program.requiredOption(
  '-q, --queryId <value>',
  'CloudWatch Logs Insights query ID',
);
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const queryId: string = program.opts().queryId;

  const data = await cloudWatchLogs
    .getQueryResults({
      queryId,
    })
    .promise();

  const { status, results } = data;

  console.log(`Status: ${status}`);
  console.log('Results:');
  console.log(results);
})();
