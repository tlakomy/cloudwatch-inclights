#!/usr/bin/env node
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';
import { subDays } from 'date-fns';

program.requiredOption(
  '-g, --logGroupName <value>',
  'The log group on which to perform the query',
);
program.option(
  '-l, --limit <value',
  'Limit the number of results (10 by default)',
  '10',
);
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const logGroupName: string = program.opts().logGroupName;
  const limit: string = program.opts().limit;

  const data = await cloudWatchLogs
    .startQuery({
      startTime: +subDays(new Date(), 5),
      endTime: +new Date(),
      queryString: `fields @timestamp, @message
        | filter @message like 'error'
        | sort @timestamp desc
        | limit ${limit}`,
      logGroupName,
    })
    .promise();

  console.log(
    'Query started, call get-query-results with the following queryId:',
  );
  console.log(data);
})();
