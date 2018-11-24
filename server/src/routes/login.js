const _ = require('lodash')
const passport = require('koa-passport')

const logger = require('../logger')


module.exports = async function (ctx) {
    return passport.authenticate('local', async function(err, user, info, status) {
        err && ctx.throw(err)
        if (user === false) {
            logger.warn('Ошибка автоиизации')
            ctx.throw(401)
        } else {
            await ctx.login(user)
            ctx.body = { success: true }
        }
    })(ctx)
}
