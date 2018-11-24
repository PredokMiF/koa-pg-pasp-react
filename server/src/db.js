const path = require('path')
const PgAsync = require('pg-async').default

const cfg = require('./config')
const logger = require('./logger')


module.exports.init = async function init() {
    const { host, port, user, password, database } = cfg.pg

    const pgAsync = new PgAsync({ host, port, user, password, database })

    const TEST_SQL = 'SELECT 1 + 1;'
    await pgAsync.query(TEST_SQL)
    logger.info(`Test SQL (${TEST_SQL}) executed`)
    module.exports = pgAsync

    await require('./utils/dbUpdater')({
        pgAsync,
        logger,
        dbConnCfg: { host, port, user, password, database },
        dbUpdaterTaskDir: path.join(__dirname, '..', 'dbUpdate'),
        taskParam: { cfg },
    })

}
