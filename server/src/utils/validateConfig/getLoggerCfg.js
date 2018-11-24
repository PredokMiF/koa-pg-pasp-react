const fs = require('async-file')
const fse = require('fs-extra')
const Joi = require('joi')


const CFG_SCHEMA = Joi.object().keys({

    logger: Joi.object().keys({
        logLevel: Joi.array().items(
            Joi.string().valid('debug', 'info', 'warn', 'error')
        ).required(),
        logDir: Joi.string().min(1).required(),
        maxsize: Joi.number().integer().min(1024).required(),
        useConsole: Joi.boolean().required(),
    }).required().options({ allowUnknown: false }),

}).required().options({ abortEarly: true, allowUnknown: true })


module.exports = async function getLoggerCfg(configPath) {

    // Try to get logger options from config

    if (!await fs.exists(configPath)) {
        throw `Config file ${configPath} does not exist`
    }

    let loggerCfg
    try {
        const config = await Joi.validate(require(configPath), CFG_SCHEMA)
        loggerCfg = config.logger
    } catch (e) {
        throw `Config is broken. Details: ${e.message}`
    }

    await fse.ensureDir(loggerCfg.logDir)

    return loggerCfg
}
