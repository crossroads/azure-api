#!/usr/bin/env node

/**
 * Command line utility to delete file from Azure file share
 * option {string}    directory        the directory on file share, defaults to root
 * option {string}    file             the file to be deleted
 *
 */

var storage = require('./storage-utils');
var program = require('commander');

program
  .option('-d, --directory [directory]', 'directory, defaults to root')
  .option('-f, --file <file>', 'file name');

program.on('--help', function(){
  console.log('  Example Usage:');
  console.log('');
  console.log('    $ export AZURE_HOST=https://myaccount.file.core.windows.net');
  console.log('    $ export AZURE_SAS_TOKEN="sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d"');
  console.log('    $ export AZURE_SHARE=myshare');
  console.log('    $ azure-filestore delete -d android -f app-debug.apk');
  console.log('');
});

program.parse(process.argv);

if (!program.directory) {
  program.directory = '';
}

// code below exports delete as well as makes it a method of the azureFilestore object
// this allows running this script stand alone from the command line and importing the code
// in another module.
(function(){
  var azureFilestore = {};
  exports.delete = azureFilestore.delete = function(directory, file, callback) {

    if (process.env.CI) {
      var fileService = storage.ConnectFileshareWithSas();

      console.log("Deleting file from Azure Storage...");

      // signature: deleteFileIfExists(share, directory, file, [options], callback)
      fileService.deleteFileIfExists(process.env.AZURE_SHARE, directory, file, function(error, result, response) {
        if (!error) {
          if (result) {
            console.log("File %s successfully deleted from Azure storage", file);
            return callback(null, true);
          }
          else {
            console.log("File %s not found on Azure storage", file);
            return callback(null, false);
          }
        }
        else {
          console.log("Error deleting file from Azure storage");
          console.log(error);
          return callback(error, null);
        }
      });

    }
  }

  // module.parent returns true only when this module is required by another.
  if (!module.parent) {
    azureFilestore.delete(program.directory, program.file);
  }
})();

