module.exports = async function (ctx) {
    ctx.logout()
    delete ctx.session.user
    ctx.body = { success: true }
}
