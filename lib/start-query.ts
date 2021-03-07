#!/usr/bin/env node
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';
import { subDays } from 'date-fns';

program.requiredOption(
  '-l, --logGroupName <value>',
  'The log group on which to perform the query',
);
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const logGroupName: string = program.opts().logGroupName;

  const data = await cloudWatchLogs
    .startQuery({
      startTime: +subDays(new Date(), 5),
      endTime: +new Date(),
      queryString: `fields @timestamp, @message
        | filter @message like 'error'
        | sort @timestamp desc
        | limit 2`,
      logGroupName,
    })
    .promise();

  console.log(data);
})();
