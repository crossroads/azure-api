#!/usr/bin/env node

/**
 * Unit tests for the Azure script
 */

var chai = require('chai');
var sinonChai = require('sinon-chai');
var proxyquire = require('proxyquire').noCallThru();   // do not call base module method if stub not defined
var expect = chai.expect;
chai.use(sinonChai);

var utils = require('./test-utils');
var testFile = 'test.txt';
var testDir = 'dev';

// create the test file
var fs = require('fs');
fs.open(testFile, 'w', function(err) {
  console.log(' + ' + testFile);
});

describe('azure-filestore-upload', function() {

  // mock azure result object
  function Result(exists) {
    this.exists = exists;
  }

  // possible responses from azure
  var no_err = null;
  var err = "error";
  var response_ok = "success";
  var response_not_ok = "fail";
  var resource_found = new Result(true);
  var resource_not_found = new Result(false);

  // Scenario 1: no error
  var azureStub = utils.GetAzureStub(no_err, resource_found, response_ok);
 
  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();
  var azureFilestore = require('../app/azure-filestore-upload.js');

  // upload successful
  describe('upload successful', function() {
    azureFilestore.upload(testDir, testFile, testFile, function(error, filename) {
      it('file uploaded', function() {
        expect(filename).to.equal(testFile);
      });
      it('no error', function() {
        expect(error).to.equal(null);
      });
    });
  });

  // Scenario 2: error
  // cannot test this because of the file exists check that preceeds the download
  // error is trapped there

});

// delete the test file
fs.unlink(testFile, function(err) {
  console.log(' - ' + testFile);
});
