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
  );

program.parse(process.argv);
