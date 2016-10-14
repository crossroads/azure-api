#!/usr/bin/env node

/**
 * Command line utility to download file from Azure file share
 * option {string}    directory        the directory on file share, defaults to root
 * option {string}    file             the file to be downloaded
 *
 */

var storage = require('storage-utils');
var program = require('commander');

program
  .option('-d, --directory [directory]', 'download directory, defaults to root')
  .option('-f, --file <file>', 'file name');

program.on('--help', function(){
  console.log('  Example Usage:');
  console.log('');
  console.log('    $ export AZURE_HOST=https://myaccount.file.core.windows.net');
  console.log('    $ export AZURE_SAS_TOKEN="sv=2012-02-12&st=2009-02-09&se=2009-02-10&sr=c&sp=r&si=YWJjZGVmZw%3d%3d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d"');
  console.log('    $ export AZURE_SHARE=myshare');
  console.log('    $ azure-filestore download -f app.mobileprovision');
  console.log('');
});

program.parse(process.argv);

if (!program.directory) {
  program.directory = '';
}

// code below exports download as well as makes it a method of the azureFilestore object
// this allows running this script stand alone from the command line and importing the code
// in another module.
(function(){
  var azureFilestore = {};
  exports.download = azureFilestore.download = function(directory, file, callback) {

    if (process.env.CI) {
      var fileService = storage.ConnectFileshareWithSas();

      storage.FileExists(fileService, directory, file, function(err, found) {
        if (found) {
          console.log("Downloading file from Azure Storage...");

          // signature: getFileToLocalFile(share, directory, file, localFileName, [options], callback)
          // empty string ('') refers to base directory
          fileService.getFileToLocalFile(process.env.AZURE_SHARE, directory, file, file, function(error, result, response) {
            if (!error) {
              console.log("File %s successfully downloaded from Azure storage", file);
              return callback(null, file);
            }
            else {
              console.log("Error downloading file from Azure storage");
              console.log(error);
              return callback(error, null);
            }
          });
        }
      });
    }    
  }

  // module.parent returns true only when this module is required by another.
  if (!module.parent) {
    azureFilestore.download(program.directory, program.file, program.file);
  }
})();

