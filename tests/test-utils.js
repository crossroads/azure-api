#!/usr/bin/env node

/**
 * Utility functions
 */
var sinon = require('sinon');

// Mock Azure environment variables
// variables are available only to the script
process.env['AZURE_HOST'] = 'dummy';
process.env['AZURE_SHARE'] = 'dummy';
process.env['AZURE_SAS_TOKEN'] = 'dummy';

// set the CI variable
process.env['CI'] = 'dev';

// azure-storage stub
exports.GetAzureStub = function(err, result, response) {
  // Stub out the file service
  // the first argument to callsArgWith is the index of the callback
  // the remaining are the arguments to callback
  var fileServiceStub = {
    doesFileExist: sinon.stub().callsArgWith(3, err, result, response),
    doesDirectoryExist: sinon.stub().callsArgWith(2, err, result, response)
  };

  // Set up a mock 'azure' object that is returned when require('azure-storage') is used.
  var azureStub = {
    createFileServiceWithSas: sinon.stub().returns(fileServiceStub)
  };

  return azureStub;
}

// storage-utils stub
exports.GetStorageUtilsStub = function (err, result, response) {
  // stub out the file service
  var fileServiceStub = {
    getFileToLocalFile: sinon.stub().callsArgWith(4, err, result, response),
    createFileFromLocalFile: sinon.stub().callsArgWith(4, err, result, response),
    deleteFileIfExists: sinon.stub().callsArgWith(3, err, result, response)
  };

  // stub out storage-utils.js
  var storageUtilsStub = {
    ConnectFileshareWithSas: sinon.stub().returns(fileServiceStub),
    FileExists: sinon.stub().callsArgWith(3, err, result),
    DirExists: sinon.stub().callsArgWith(2, err, result)
  };

  return storageUtilsStub;
}
