#!/usr/bin/env node
import CloudWatchLogs, {
  QueryDefinitionList,
} from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';

program.option('-l, --logGroupName <value>', 'Filter by log group name');
program.option(
  '-p, --queryDefinitionNamePrefix <value>',
  'Filter results to only the query definitions that start with a prefix',
);
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const logGroupName: string = program.opts().logGroupName;
  const queryDefinitionNamePrefix: string | undefined = program.opts()
    .queryDefinitionNamePrefix;

  const data = await cloudWatchLogs
    .describeQueryDefinitions({ queryDefinitionNamePrefix })
    .promise();
  const { queryDefinitions } = data;

  if (logGroupName) {
    const filteredQueryDefinitions = queryDefinitions?.reduce((acc, query) => {
      const containsLogGroupName = query.logGroupNames?.some((logGroup) =>
        logGroup.toLowerCase().includes(logGroupName.toLowerCase()),
      );

      if (containsLogGroupName) {
        acc.push(query);
      }
      return acc;
    }, <QueryDefinitionList>[]);

    console.log(
      `Here are all saved queries filtered by "${logGroupName}" log group name:`,
    );
    console.log(filteredQueryDefinitions);

    return;
  }

  console.log(queryDefinitions);
})();
