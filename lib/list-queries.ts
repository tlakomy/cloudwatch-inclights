#!/usr/bin/env node
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';

program.option('-l, --logGroupName <value>', 'Filter by log group name');
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const data = await cloudWatchLogs
    .describeQueries({ status: 'Complete' })
    .promise();

  const logGroupName: string = program.opts().logGroupName;

  if (logGroupName) {
    const filteredQueries = data.queries?.filter((query) => {
      const sourceRow = query.queryString?.split('\n')[0];
      return sourceRow?.toLowerCase()?.includes(logGroupName.toLowerCase());
    });

    console.log(filteredQueries);

    return;
  }

  console.log(data.queries);
})();
