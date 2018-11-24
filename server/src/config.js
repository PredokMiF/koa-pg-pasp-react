const logger = require('./logger')

module.exports.set = function (config) {
    logger.debug('Конфигурация загружена', config, config)
    module.exports = config;
}
