#!/usr/bin/env node

/**
 * Documents the list of sub-commands available
 * Checkout the repo and run `npm install`
 * Try commands below for usage instructions:
 *   azure-filestore -h
 *   azure-filestore help download
 */

var program = require('commander');

// functionalities implemented
program
  .version('0.0.1')
  .command('download [directory] <file>', 'download a file from Azure storage')
  .command('upload [directory] <file>', 'upload a file to Azure storage (file is overwritten if it exists)')
  .command('delete [directory] <file>', 'delete a file from Azure storage') 
  .parse(process.argv)
