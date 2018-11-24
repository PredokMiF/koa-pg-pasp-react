const pgAsync = require('../db')


module.exports = async function userGetByLoginPass(login, pass) {
    const users = await pgAsync.rows(`SELECT id, login FROM "user" WHERE login = $1 AND pass = $2;`, login, pass)

    return users.length === 1 ? users[0] : null
}
