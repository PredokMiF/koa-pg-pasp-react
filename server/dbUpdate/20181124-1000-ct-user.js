async function task({ pgAsync }) {
    await pgAsync.transaction(async (pgAsync) => {
        await pgAsync.query(`
            CREATE TABLE "user" (
                id serial NOT NULL,
                login character varying(255),
                pass character varying(255),
                PRIMARY KEY (id)
            );
        `)

        await pgAsync.query(`
            INSERT INTO "user" (login, pass) VALUES ('admin', '34tvq3v4tqc')
        `)
    })
}

module.exports = task
