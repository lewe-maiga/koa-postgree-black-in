import {RouterContext} from "@koa/router"
import router from "../lib/router"

import {auth} from "../middleware/authenticated"
import {FileInput, removeFile, upload} from "../lib/utils"
import pool from "../database/postsgre"

router.get("/artists", auth, async (ctx: RouterContext) => {
    try {
        const artists = await pool
            .query("SELECT * FROM artists")
            .then((res) => res.rows)
            .catch((err) => {
                throw err
            })
        if (artists.length === 0) {
            ctx.body = artists
            return
        }
        for (const artist of artists) {
            const image = await pool
                .query("SELECT * FROM upload WHERE id = $1", [artist.image])
                .then((res) => res.rows[0])
                .catch((err) => {
                    throw err
                })
            artist.image = image
        }
        ctx.body = artists
    } catch (err) {
        console.log(err)
        throw err
    }
})

router.get("/artists/:id", auth, async (ctx: RouterContext) => {
    try {
        const {id} = ctx.params
        const artist = await pool
            .query("SELECT * FROM artists WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!artist) ctx.throw(401, "artist not found")
        const image = await pool
            .query("SELECT * FROM upload WHERE id = $1", [artist.image])
            .then((res) => res.rows)
            .catch((err) => {
                throw err
            })
        artist.image = image
        ctx.body = artist
    } catch (err) {
        console.log(err)
        throw err
    }
})

router.post("/artists", auth, async (ctx: RouterContext) => {
    let file
    try {
        await pool.query("BEGIN")

        const {pseudo} = ctx.request.body
        if (!pseudo) ctx.throw(422, "pseudo required")
        const files = ctx.request.files
        if (!files) ctx.throw(422, "image required")

        const temp = files["image"] as FileInput
        const image = await upload(temp)
        file = image
        const {id} = await pool
            .query(
                "INSERT INTO artists(pseudo, image) VALUES($1, $2) RETURNING id",
                [pseudo, image?.id]
            )
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })

        const artist = {
            id,
            pseudo,
            image,
        }

        ctx.body = artist
        await pool.query("COMMIT")
    } catch (err) {
        console.log(err)
        if (file) removeFile(file.url)
        await pool.query("ROLLBACK")
        console.log("ROLLBACK")
        throw err
    }
})

router.put("/artists/:id", auth, async (ctx: RouterContext) => {
    try {
        await pool.query("BEGIN")
        const {id} = ctx.params

        const {pseudo} = ctx.request.body
        const files = ctx.request.files
        if (!pseudo && !files) ctx.throw(422, "data required")
        const artist = await pool
            .query("SELECT * FROM artists WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!artist) ctx.throw(401, "artist not found")
        let image = null

        const args = {
            id,
            pseudo: pseudo ? pseudo : artist.pseudo,
        }
        await pool.query("UPDATE artists SET pseudo = $1 WHERE id = $2", [
            args.pseudo,
            id,
        ])
        if (files && Object.keys(files).length === 1) {
            const file = "SELECT * FROM upload WHERE id = $1"
            const {url} = await pool
                .query(file, [artist.image])
                .then((res) => res.rows[0])
                .catch((err) => {
                    throw err
                })
            const temp = files["image"] as FileInput
            image = await upload(temp, artist.image)
            removeFile(url)
            console.log("With file")

            artist.image = image
        } else {
            const file = "SELECT * FROM upload WHERE id = $1"
            const picture = await pool
                .query(file, [artist.image])
                .then((res) => res.rows[0])
                .catch((err) => {
                    throw err
                })
            console.log("Without file")
            artist.image = picture
        }
        ctx.body = {
            ...artist,
            pseudo: args.pseudo,
        }
        await pool.query("COMMIT")
        console.log("COMMIT")
    } catch (err) {
        console.log(err)
        await pool.query("ROLLBACK")
        console.log("ROLLBACK")

        throw err
    }
})

router.delete("/artists/:id", auth, async (ctx: RouterContext) => {
    try {
        await pool.query("BEGIN")
        const {id} = ctx.params
        const artist = await pool
            .query("SELECT * FROM artists WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!artist) ctx.throw(401, "artist not found")
        const image = await pool
            .query("SELECT * FROM upload WHERE id = $1", [artist.image])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })

        console.log(image)
        await pool.query("DELETE FROM artists WHERE id = $1", [id])
        await pool.query("DELETE FROM upload WHERE id = $1", [artist.image])

        removeFile(image.url)
        artist.image = image
        await pool.query("COMMIT")
        console.log("COMMIT")

        ctx.body = artist
    } catch (err) {
        console.log(err)
        await pool.query("ROLLBACK")
        console.log("ROLLBACK")

        throw err
    }
})

export default router
