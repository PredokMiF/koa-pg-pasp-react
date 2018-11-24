const convert = require('koa-convert')

const cfg = require('../config')

// Mongo

const KoaSessionMongo = require('koa-session-mongo')

const koaSessionMongo = KoaSessionMongo.create({
    url: cfg.mongoConnStr,
    auto_reconnect: true,
})


// Store

const SessionStore = require('koa-session-store')
const sessionStore = SessionStore({
    store: koaSessionMongo
})


const koa2SessionMiddleware = convert(sessionStore)

module.exports = {
    koaSessionMongo,
    sessionStore,
    koa2SessionMiddleware,
}
