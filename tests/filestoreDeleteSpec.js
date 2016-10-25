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

describe('azure-filestore-delete', function() {

  // possible responses from azure
  var no_err = null;
  var err = "error";
  var response_ok = "success";
  var response_not_ok = "fail";
  var resource_found = true;
  var resource_not_found = false;

  // Scenario 1: no error, file exists
  var storageStub = utils.GetStorageUtilsStub(no_err, resource_found, response_ok);

  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var azureFilestore = proxyquire('../app/azure-filestore-delete.js', { './storage-utils': storageStub });

  // delete successful
  describe('no error, file exists', function() {
    azureFilestore.delete(testDir, testFile, function(error, flag) {
      it('file deleted', function() {
        expect(flag).to.equal(true);
      });
      it('no error', function() {
        expect(error).to.equal(null);
      });
    });
  });

  // Scenario 2: no error, file does not exist
  var storageStub = utils.GetStorageUtilsStub(no_err, resource_not_found, response_ok);
  var azureFilestore = proxyquire('../app/azure-filestore-delete.js', { './storage-utils': storageStub });

  // file not found
  describe('no error, file does not exist', function() {
    azureFilestore.delete(testDir, testFile, function(error, flag) {
      it('file not found', function() {
        expect(flag).to.equal(false);
      });
      it('no error', function() {
        expect(error).to.equal(null);
      });
    });
  });

  // Scenario 3: error
  var storageStub = utils.GetStorageUtilsStub(err, resource_found, response_not_ok);
  var azureFilestore = proxyquire('../app/azure-filestore-delete.js', { './storage-utils': storageStub });

  // file not found
  describe('error deleting file', function() {
    azureFilestore.delete(testDir, testFile, function(error, flag) {
      it('flag not set', function() {
        expect(flag).to.equal(null);
      });
      it('error', function() {
        expect(error).to.equal(error);
      });
    });
  });

});

