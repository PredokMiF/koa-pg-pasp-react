const pgAsync = require('../db')


module.exports = async function userGet(id) {
    return await pgAsync.row(`SELECT id, login FROM "user" WHERE id = $1;`, id)
}
