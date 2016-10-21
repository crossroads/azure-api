#!/usr/bin/env node

/**
 * Command line utility to upload file to Azure file share
 * option {string}    directory        the directory on file share, defaults to root
 * option {string}    file             the file to be uploaded
 * option {string}    target           the name of the file on Azure
 *
 * Dependencies:
 * Script expects the following environment variables to be set.
 * - AZURE_SHARE
 * There is an indirect dependency on the following via fileshare.js
 * - AZURE_HOST
 * - AZURE_SAS_TOKEN
 *
 */

var storage = require('./storage-utils');
var fs = require('fs');
var program = require('commander');

program
  .option('-d, --directory [directory]', 'upload directory, defaults to root')
  .option('-f, --file <file>', 'local file name')
  .option('-t, --target [target]', 'target file name, defaults to local file name');

program.on('--help', function(){
  console.log('  Example Usage:');
  console.log('');
  console.log('    $ export AZURE_HOST=https://myaccount.file.core.windows.net');
  console.log('    $ export AZURE_SAS_TOKEN="sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d"');
  console.log('    $ export AZURE_SHARE=myshare');
  console.log('    $ azure-filestore upload -d android -f app-debug.apk -t app-staging.goodcity.hk-0.11.0.apk');
  console.log('');
});

program.parse(process.argv);

if (!program.directory) {
  program.directory = '';
}

if (!program.target) {
  program.target = program.file;
}

// code below exports upload as well as makes it a method of the azureFilestore object
// this allows running this script stand alone from the command line and importing the code
// in another module.
(function(){
  var azureFilestore = {};
  exports.upload = azureFilestore.upload = function(directory, target, file, callback) {

    if (process.env.CI) {
      var fileService = storage.ConnectFileshareWithSas();

      if (fs.existsSync(file)) {
        storage.DirExists(fileService, directory, function(err, found) {
          if (found) {
            console.log("Uploading file to Azure Storage...");

            // signature: createFileFromLocalFile(share, directory, file, localFile, options, callback)
            // file is overwritten if it exists
            fileService.createFileFromLocalFile(process.env.AZURE_SHARE, directory, target, file, function(error, result, response) {
              if (!error) {
                console.log("File %s successfully uploaded to Azure storage", file);
                return callback(null, target);
              }
              else {
                console.log("Error uploading file to Azure storage");
                console.log(error);
                return callback(error, null);
              }
            });
          }
        });
      }
      else {
        console.log("File %s not found", file);
      }
    }
  }


  // module.parent returns true only when this module is required by another.
  if (!module.parent) {
    azureFilestore.upload(program.directory, program.file, program.file);
  }
})();

