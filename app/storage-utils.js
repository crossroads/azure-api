#!/usr/bin/env node

/* 
 * Utility functions
 * Dependencies:
 * Script expects the following environment variables to be set.
 * - AZURE_HOST
 * - AZURE_SAS_TOKEN
 * - AZURE_SHARE
 *
 * Example Usage:
 * export AZURE_HOST='https://myaccount.file.core.windows.net'
 * export AZURE_SAS_TOKEN='sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d'
 * export AZURE_SHARE=myshare
 *
 * // example.js
 * var storage = require('./storage-utils');
 *
 */

var azure = require('azure-storage');

// Creates a file service object using SAS token

exports.ConnectFileshareWithSas = function() {
  // signature: createFileServiceWithSas(host, sasToken)
  var fileService = azure.createFileServiceWithSas(process.env.AZURE_HOST, process.env.AZURE_SAS_TOKEN);
  return fileService;
}


// checks for file within specified directory on azure storage
// returns a callback with a boolean flag set to indicate if file exists

exports.FileExists = function(fileService, dir, file, callback) {
  // signature: doesFileExist(share, directory, file, [options], callback)
  fileService.doesFileExist(process.env.AZURE_SHARE, dir, file, function(error, result, response) {
    if (!error) {
      if (result.exists) {
        console.log("File %s found on Azure storage", file);
        return callback(null, true);
      }
      else {
        console.log("File %s not found on Azure storage", file);
        return callback(null, false);
      }
    }
    else {
      console.log("Error checking for file");
      console.log(error);
      return callback(error, false);
    }
  });
}


// checks for the directory on azure storage
// returns a callback with a boolean flag set to indicate if directory exists

exports.DirExists = function(fileService, dir, callback) {
  // signature: doesDirectoryExist(share, directory, [options], callback)
  fileService.doesDirectoryExist(process.env.AZURE_SHARE, dir, function(error, result, response) {
    if (!error) {
      if (result.exists) {
        console.log("Directory %s found on Azure storage", dir);
        return callback(null, true);
      }
      else {
        console.log("Directory %s not found on Azure storage", dir);
        return callback(null, false);
      }
    }
    else {
      console.log("Error checking for directory");
      console.log(error);
      return callback(error, false);
    }
  });
}
