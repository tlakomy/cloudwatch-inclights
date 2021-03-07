#!/usr/bin/env node
import { program } from 'commander';

program
  .version('0.1.0')
  .command('list-queries', 'list CloudWatch Logs Insights queries', {
    executableFile: 'list-queries',
  })
  .command(
    'list-saved-queries',
    'list saved CloudWatch Logs Insights queries',
    {
      executableFile: 'list-saved-queries',
    },
  )
  .command(
    'start-query',
    'schedules a query of a log group using CloudWatch Logs Insights',
    {
      executableFile: 'start-query',
    },
  )
  .command(
    'get-query-results',
    'returns the results from the specified CloudWatch Logs Insights query',
    {
      executableFile: 'get-query-results',
    },
  );

program.parse(process.argv);
