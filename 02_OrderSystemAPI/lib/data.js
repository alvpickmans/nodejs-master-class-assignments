/**
 * @description Library for storing and editing data
 */

 // Dependencies
 var fs = require('fs');
 var path = require('path');
 var helpers = require('./helpers');

 // Declare module
 var lib = {};
 
 // Define base directory
 lib.baseDir = path.join(__dirname, '/../.data/');

 //Method to return actual json file path
 var datafile = function(dir, file){
     return lib.baseDir + dir + '\\' + file + '.json';
 }

 // Write data to a file
 lib.create = function(dir, file, data, callback){
    // Open the file for writing
    fs.open(datafile(dir, file), 'wx', (err, fileDescriptor) =>{
        if(!err && fileDescriptor){
            // Convert data to string
            var stringData = JSON.stringify(data, null, "\t");

            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err)=>{
                if(!err){
                    fs.close(fileDescriptor, (err) =>{
                        if(!err){
                            callback(false);
                        }else{
                            callback('Error closing new file');
                        }
                    })
                } else{
                    callback('Error writing to new file');
                }
            })
        } else{
            callback('Could not create new file, it may already exist');
        }
    })
 };

/**
 * Reads a file given its name and location
 * @param {string} dir Collection to read from
 * @param {string} file Name of the file on collection to read
 */
 lib.read = function(dir, file){
     return new Promise((resolve, reject) => {
        fs.readFile(datafile(dir, file),'utf8', (err, data) =>{
            if(!err  && data){
               var parsedData = helpers.parseJsonStringToObject(data);
               resolve(parsedData);
            }else{
               reject(err);
            }
        });
     });
 };

 // Update data inside the file
 lib.update = function(dir, file, data, callback){
    fs.open(datafile(dir, file), 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor){
            // Convert data to string
            var stringData = JSON.stringify(data);

            // Truncate the file
            fs.truncate(fileDescriptor, (err) => {
                if(!err){
                    // Write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err) =>{
                        if(!err){
                            fs.close(fileDescriptor, (err) => {
                                if(!err){
                                    callback(false);
                                }else{
                                    callback('Error closing the file');
                                }
                            });
                        }else{
                            callback('Error writing to existing file');
                        }
                    });
                } else{
                    callback('Error truncating file');
                }
            });
        } else{
            callback('Could not open the file for updating, it may not exist');
        }
    });
 };

 // Delete the file
 lib.delete = function(dir, file, callback){
    // Unlink (remove) the file
    fs.unlink(datafile(dir, file), (err) => {
        if(!err){
            callback(false);
        } else{
            callback('Error deleting the file');
        }
    });
 };

 // List all the items on a directory
 lib.list = function(dir, callback){
    fs.readdir(lib.baseDir+dir+'/', (err, data) => {
        if(!err && data && data.length > 0){
            var files = [];
            data.forEach((fileName) => {
                files.push(fileName.replace('.json',''));
            });

            callback(false, files); 
        }else{
            callback(err, data);
        }
    });
 };

 // Export module
module.exports = lib;