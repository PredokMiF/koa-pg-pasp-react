const Koa = require('koa')

const logger = require('./logger')
const cfg = require('./config')


module.exports.start = async function () {
    const app = new Koa()

    app.proxy = true
    app.keys = cfg.http.koaAppKeys

    // Static files
    require('./koaUse/favicon')(app)
    require('./koaUse/static')(app)

    // Err handle
    require('./koaUse/errHandler')(app)

    // Session
    app.use(require('./koaUse/session').koa2SessionMiddleware)

    require('./koaUse/koaBody')(app)

    // Passport
    require('./koaUse/passportStrategy')(app)

    // Routes
    // require('./koaUse/noCache')(app);
    require('./routes')(app);

    // 404
    app.use(require('./koaUse/pageNotFound'))

    const server = app.listen(cfg.http.port)

    server.on('error', function (err) {
        logger.error('server on error', err);
    })

    logger.info(`Сервер запустился на порту ${cfg.http.port}`)
}
