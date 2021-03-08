#!/usr/bin/env node
import CloudWatchLogs from 'aws-sdk/clients/cloudwatchlogs';
import { Logger } from 'tslog';
import { program } from 'commander';

program.requiredOption(
  '-q, --queryId <value>',
  'CloudWatch Logs Insights query ID',
);
program.parse(process.argv);

const cloudWatchLogs = new CloudWatchLogs({ apiVersion: '2014-03-28' });
const log = new Logger({
  displayDateTime: false,
  displayFunctionName: false,
  displayFilePath: 'hidden',
  logLevelsColors: {
    '0': 'white',
    '1': 'white',
    '2': 'white',
    '3': 'white',
    '4': 'white',
    '5': 'white',
    '6': 'white',
  },
});

void (async () => {
  const queryId: string = program.opts().queryId;

  const data = await cloudWatchLogs
    .getQueryResults({
      queryId,
    })
    .promise();

  const { status, results, statistics } = data;
  log.info(`Status: ${status}`);

  if (results) {
    const parsedMessagesResult = results.map((resultRow) =>
      resultRow
        // We don't really need the @ptr field
        .filter((resultField) => resultField.field !== '@ptr')
        .map((resultField) => {
          if (resultField.field === '@message') {
            resultField.value = JSON.parse(resultField.value || '');
          }

          return resultField;
        }),
    );
    log.info('Results:');
    log.info(parsedMessagesResult);

    log.info('Statistics:', statistics);
    return;
  }

  log.info('No results yet');
})();
