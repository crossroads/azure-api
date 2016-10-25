# azure-api

A nodejs based command line tool to interface with Microsoft Azure services.
It currently supports interfacing with the following services
* [File Storage](https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-how-to-use-files/#what-is-azure-file-storage)

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [SAS](https://azure.microsoft.com/en-us/documentation/articles/storage-dotnet-shared-access-signature-part-1/#what-is-a-shared-access-signature) to access the Azure resource

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`

## Usage Instructions

The utility requires the environment variables AZURE_HOST, AZURE_SHARE and AZURE_SAS_TOKEN to point to the Azure host url, file share name and SAS token respectively.

Run `azure-filestore -h` for a list of available commands

Run `azure-filestore help <sub-command>` for help with a specific sub-command

## Running tests

Run `npm test` to run unit test suite.

Tests depend on the following packages
* [mocha](https://www.npmjs.com/package/mocha) : Test runner
* [chai](https://www.npmjs.com/package/chai) : Assertion library
* [sinon](https://www.npmjs.com/package/sinon) : Mocking/Stubbing library
* [sinon-chai](https://www.npmjs.com/package/sinon-chai) : Assertions for the sinon framework
* [proxyquire](https://www.npmjs.com/package/proxyquire): Allows replacing modules with other modules for `require` inside a test subject
* [istanbul](https://github.com/gotwarlost/istanbul): code coverage
