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
  var azureFilestore = proxyquire('../app/azure-filestore-upload.js', { 'storage-utils': storageStub });

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
  var storageStub = utils.GetStorageUtilsStub(err, resource_found, response_not_ok);
  var azureFilestore = proxyquire('../app/azure-filestore-upload.js', { 'storage-utils': storageStub });

  // upload failed
  describe('upload failed', function() {
    azureFilestore.upload(testDir, testFile, testFile, function(error, filename) {
      it('file uploaded', function() {
        expect(filename).to.equal(null);
      });
      it('no error', function() {
        expect(error).to.equal(err);
      });
    });
  });

});

// delete the test file
fs.unlink(testFile, function(err) {
  console.log(' - ' + testFile);
});
