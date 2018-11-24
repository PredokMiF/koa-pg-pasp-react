const _ = require('lodash')
const path = require('path')
const fse = require('fs-extra')
const fs = require('async-file')
const MD5 = require('md5')


async function init({
    pgAsync,
    logger,
    dbUpdaterTaskDir,
    dbUpdaterTableName = 'dbUpdater',
    taskParam = {},
}) {

    // DB UPDATE

    await pgAsync.query(`
        CREATE TABLE IF NOT EXISTS ${dbUpdaterTableName} (
            name character varying(256) NOT NULL,
            md5 character varying(128) NOT NULL,
            PRIMARY KEY (name)
        )`
    )

    const tasksToExecute = await getTasksToExecute({
        logger,
        pgAsync,
        scriptPath: dbUpdaterTaskDir,
        tableName: dbUpdaterTableName,
    })

    if (tasksToExecute.length === 0) {
        logger.info('Обновление БД не требуется')
    }

    for (let i = 0; i < tasksToExecute.length; i++) {
        const task = tasksToExecute[i]
        try {
            await require(task.path)({ pgAsync, taskParam })
            await pgAsync.query(`INSERT INTO ${dbUpdaterTableName} (name, md5) VALUES ($1, $2);`, task.name, task.md5)

            logger.info(`Обновление из файла ${task.name} было успешно выполнено`, { util: 'DB_UPDATER' })
        } catch (e) {
            logger.error(`Обновление из файла ${task.name} завершилось с ошибкой`, e, Object.assign({ util: 'DB_UPDATER' }, task))
            throw e
        }
    }

    return pgAsync
}

async function getTasksToExecute({ logger, pgAsync, scriptPath, tableName }) {
    await fse.ensureDir(scriptPath)

    const tasksToExecute = (await fs.readdir(scriptPath)).sort()
    for (let i = 0; i < tasksToExecute.length; i++) {
        const filePath = path.join(scriptPath, tasksToExecute[i])
        const fileContent = await fs.readFile(filePath, 'utf8')
        const md5 = MD5(fileContent)

        tasksToExecute[i] = {
            path: filePath,
            name: tasksToExecute[i],
            md5
        }
    }

    const executed = await pgAsync.rows(`SELECT name, md5 FROM ${tableName}`)
    const lostTasks = _.difference(executed.map(rec => rec.name), tasksToExecute.map(rec => rec.name))
    if (lostTasks.length) {
        logger.warn(`В базе выполнены обновления, которых сейчас нет: "${lostTasks.join('", "')}"`, { util: 'DB_UPDATER' })
    }
    const executedMap = executed.reduce((out, { name, md5 }) => {
        out[name] = md5
        return out
    }, {})

    const tasksToExecuteFinal = []
    for (let i = 0; i < tasksToExecute.length; i++) {
        const taskToExecute = tasksToExecute[i]
        if (executedMap[taskToExecute.name]) {
            if (taskToExecute.md5 !== executedMap[taskToExecute.name]) {
                logger.warn(`В базе выполнено обновление, но MD5 не совпадает`, {
                    util: 'DB_UPDATER',
                    taskName: taskToExecute.name,
                    executedMd5: executedMap[taskToExecute.name],
                    currentMd5: taskToExecute.md5
                })
            }
        } else {
            tasksToExecuteFinal.push(taskToExecute)
        }
    }

    return tasksToExecuteFinal
}

module.exports = init
