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

describe('storage-utils', function() {

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

  // Scenario 1: no error, resource found
  var azureStub = utils.GetAzureStub(no_err, resource_found, response_ok);
  
  // Execute the test subject by using proxyquire to load our script, passing in dependencies
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();

  // file service object
  describe('file service:', function() {
    it('stub is created', function() {
      expect(azureStub.createFileServiceWithSas).to.have.been.calledWith(process.env['AZURE_HOST'], process.env['AZURE_SAS_TOKEN']);
    });
  });  

  // validations
  describe('file validations - no error, file exists', function() {
    storage.FileExists(fileService, testDir, testFile, function(error, found) {
      it('checks if remote file exists', function() {
        expect(fileService.doesFileExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir, testFile);
      });

      it('remote file found', function() {
        expect(found).to.equal(true);
      });
    });
  });

  describe('directory validations - no error, directory exists', function() {
    storage.DirExists(fileService, testDir, function(error, found) {
      it('checks if remote directory exists', function() {
        expect(fileService.doesDirectoryExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir);
      });
      
      it('remote directory found', function() {
        expect(found).to.equal(true);
      });
    });
  });


  // Scenario 2: no error, resource not found
  var azureStub = utils.GetAzureStub(no_err, resource_not_found, response_ok);
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();

  describe('file validations - no error, file does not exist', function() {
    storage.FileExists(fileService, testDir, testFile, function(error, found) {
      it('checks if remote file exists', function() {
        expect(fileService.doesFileExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir, testFile);
      });

      it('remote file not found', function() {
        expect(found).to.equal(false);
      });
    });
  });

  describe('directory validations - no error, directory does not exist', function() {
    storage.DirExists(fileService, testDir, function(error, found) {
      it('checks if remote directory exists', function() {
        expect(fileService.doesDirectoryExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir);
      });

      it('remote directory not found', function() {
        expect(found).to.equal(false);
      });
    });
  });

  // Scenario 3: error
  var azureStub = utils.GetAzureStub(err, resource_found, response_not_ok);
  var storage = proxyquire('../app/storage-utils.js', { 'azure-storage': azureStub });
  var fileService = storage.ConnectFileshareWithSas();

  describe('file validations - error', function() {
    storage.FileExists(fileService, testDir, testFile, function(error, found) {
      it('checks if remote file exists', function() {
        expect(fileService.doesFileExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir, testFile);
      });

      it('error checking for file', function() {
        expect(error).to.equal(err);
      });
    });
  });

  describe('directory validations - error', function() {
    storage.DirExists(fileService, testDir, function(error, found) {
      it('checks if remote directory exists', function() {
        expect(fileService.doesDirectoryExist).to.have.been.calledWith(process.env['AZURE_SHARE'], testDir);
      });

      it('error checking for directory', function() {
        expect(error).to.equal(err);
      });
    });
  });
});
