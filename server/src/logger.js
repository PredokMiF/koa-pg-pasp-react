const { getLogger, getLoggerWrapper } = require('./utils/logger');

module.exports.init = function (cfg) {
    const logger = getLogger(cfg)

    return module.exports = getLoggerWrapper(logger)
}
