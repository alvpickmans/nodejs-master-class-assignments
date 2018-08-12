/*
* Create and export configuration variables
*
*/

/**
 * @description Container for the environments library
 */
var environments = {};

/**
 * @description Development environment. Default
 */
environments.dev = {
    'httpPort': 2000,
    'httpsPort': 2001,
    'envName': 'dev',
    'hashingSecret': 'thisIsASecret'
};

/**
 * @description Production environment
 */
environments.production = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'production',
    'hashingSecret': 'thisIsAnotherSecret'
};

// Determine which env should be exported
var env = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that current environment is on of the environments defined
var envToExport = typeof(environments[env]) == 'object' ? environments[env] : environments.dev;

// Export the module
module.exports = envToExport;