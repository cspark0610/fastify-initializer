const defer = require('config/defer').deferConfig;
const defaultsDeep = require('lodash.defaultsdeep');

module.exports = function getServiceConfig(dependency, options) {
  return defer(function (config) {
    return defaultsDeep(options, config.dependencies[dependency], {
      dependency
    });
  });
};
