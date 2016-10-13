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

  // Scenario 1: no error, file exists
  var azureStub = utils.GetAzureStub(no_err, resource_found, response_ok);
 
  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();
  var azureFilestore = require('../app/azure-filestore-delete.js');

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
  var azureStub = utils.GetAzureStub(err, false, response_ok);
 
  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();
  var azureFilestore = require('../app/azure-filestore-delete.js');

  // file not found
  describe('no error, file does not exist', function() {
    azureFilestore.delete(testDir, testFile, function(error, flag) {
      it.skip('file not found', function() {
        expect(flag).to.equal(false);
      });
      it('no error', function() {
        expect(error).to.equal(null);
      });
    });
  });

});

