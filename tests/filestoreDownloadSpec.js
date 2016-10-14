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

describe('azure-filestore-download', function() {

  // possible responses from azure
  var no_err = null;
  var err = "error";
  var response_ok = "success";
  var response_not_ok = "fail";
  var resource_found = true;
  var resource_not_found = false;

  // Scenario 1: no error
  var storageStub = utils.GetStorageUtilsStub(no_err, resource_found, response_ok);
  
  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var azureFilestore = proxyquire('../app/azure-filestore-download.js', { 'storage-utils': storageStub });

  // download successful
  describe('download successful', function() {
    azureFilestore.download(testDir, testFile, function(error, filename) {
      it('file downloaded', function() {
        expect(filename).to.equal(testFile);
      });
      it('no error', function() {
        expect(error).to.equal(null);
      });
    });
  });

  // Scenario 2: error
  var storageStub = utils.GetStorageUtilsStub(err, resource_found, response_not_ok);
  var azureFilestore = proxyquire('../app/azure-filestore-download.js', { 'storage-utils': storageStub });

  // download failed 
  describe('download failed', function() {
    azureFilestore.download(testDir, testFile, function(error, filename) {
      it('file not downloaded', function() {
        expect(filename).to.equal(null);
      });
      it('error', function() {
        expect(error).to.equal(error);
      });
    });
  });

});
