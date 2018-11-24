const path = require('path')

// const KB = 1024
// const MB = 1024 * KB


async function server() {

    // Try to read config with logger options

    const configPath = path.resolve(__dirname, 'cfg', 'cfg.js')

    const loggerCfg = await require('./src/utils/validateConfig').getLoggerCfg(configPath)
    const logger = require('./src/logger').init(loggerCfg)

    try {
        const config = await require('./src/utils/validateConfig').getFullConfig(configPath)
        require('./src/config').set(config)

        await require('./src/db').init()

        await require('./src/http').start()
    } catch (e) {
        logger.error(e)
    }
}

server().catch(e => {
    console.error(e)
})
