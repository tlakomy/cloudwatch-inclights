#!/usr/bin/env node
import CloudWatchLogs, {
  QueryDefinitionList,
} from 'aws-sdk/clients/cloudwatchlogs';
import { program } from 'commander';

program.option('-l, --logGroupName <value>', 'Filter by log group name');
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });

void (async () => {
  const data = await cloudWatchLogs.describeQueryDefinitions().promise();
  const logGroupName: string = program.opts().logGroupName;
  const { queryDefinitions } = data;

  if (logGroupName) {
    const filteredQueryDefinitions = queryDefinitions?.reduce((acc, query) => {
      if (
        query.logGroupNames?.some((logGroup) =>
          logGroup.toLowerCase().includes(logGroupName.toLowerCase()),
        )
      ) {
        acc.push(query);
      }
      return acc;
    }, <QueryDefinitionList>[]);

    console.log(filteredQueryDefinitions);

    return;
  }

  console.log(queryDefinitions);
})();
