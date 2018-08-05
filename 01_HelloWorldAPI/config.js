/*
* Create and export configuration variables
*
*/

//Container for all the environments
var environments = {};

// Dev (default) environmnet
environments.dev = {
    'http': {
        'port': 3000,
    },
    'https': {
        'port': 3001,
    },
    'envName': 'dev'
};

// Production environment
environments.production = {
    'http': {
        'port': 5000,
    },
    'https': {
        'port': 5001,
    },
    'envName': 'production'
};

// Determine which env should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that current environment is on of the environments defined
var envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.dev;

// Export the module
module.exports = envToExport;