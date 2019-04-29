/**
 * Intercept and export  global configuration variables
 * @author Adrian
 */

let environments = {};
 
// Development settings
environments.development = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'development',
};

// Production settings (if needed)
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
};

const currentEnvironment = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase : '';

// check if environment exits
var exportedEnvironment = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] 
            : environments.development;

module.exports = exportedEnvironment;