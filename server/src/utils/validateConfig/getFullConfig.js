const Joi = require('joi')

const logger = require('../../logger')


const CFG_SCHEMA = Joi.object().keys({

    logger: Joi.any(),

    pg: Joi.object().keys({
        host: Joi.string().required(),
        port: Joi.number().integer().min(80).required(),
        user: Joi.string().required(),
        password: Joi.string().required(),
        database: Joi.string().required(),
    }).required(),

    mongoConnStr: Joi.string().min(1).required(),

    http: Joi.object().keys({
        port: Joi.number().integer().min(80).required(),
        koaAppKeys: Joi.array().items(Joi.string()).min(1).required(),
    }).required(),

}).required().options({ abortEarly: true })

module.exports = async function getFullConfig(configPath) {
    try {
        return await Joi.validate(require(configPath), CFG_SCHEMA)
    } catch (e) {
        throw `Config is broken. Details: ${e.message}`
    }
}
