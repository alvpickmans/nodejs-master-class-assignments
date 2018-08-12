/**
 * Schema validator based on AJV
 * 
 */

// Dependencies
var path = require('path');
var Ajv = require('ajv');
var ajv = Ajv({ allErrors:true, removeAdditional:'all' });


// Module library to export
var lib = {};

// Schemas directory
var schemasDir = path.join(__dirname, './../.schemas');

// Adding schemas
ajv.addSchema(require(schemasDir + '/new-user.json'), 'new-user');

/**
 * Format error responses
 * @param  {Object} schemaErrors - array of json-schema errors, describing each validation failure
 * @return {String} formatted api response
 */
lib.errorResponse = (schemaErrors) => {
  var errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  });
  return {
    status: 'failed',
    errors: errors
  }
}


// Validate schema
lib.validateSchema = (schemaName, data) => {

    return new Promise((resolve, reject) => {
      let valid = ajv.validate(schemaName, data);
      if(valid){
          resolve(data);
      }
      else{
        reject(lib.errorResponse(ajv.errors));
      }
    });
}

// Export module
module.exports = lib;