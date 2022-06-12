import router from "../lib/router"
import pool from "../database/postsgre"
import {auth} from "../middleware/authenticated"
import {RouterContext} from "@koa/router"
import {FileInput, removeFile, upload} from "../lib/utils"

router.get("/posts", auth, async (ctx: RouterContext) => {
    try {
        const posts = await pool
            .query("SELECT * FROM posts")
            .then((res) => res.rows)
            .catch((err) => {
                throw err
            })
        if (posts.length !== 0) {
            for (const post of posts) {
                const selectFile = "SELECT * FROM upload WHERE id = $1"
                post.image = await pool
                    .query(selectFile, [post.image])
                    .then((res) => res.rows[0])
                    .catch((err) => {
                        throw err
                    })
                post.music = await pool
                    .query(selectFile, [post.music])
                    .then((res) => res.rows[0])
                    .catch((err) => {
                        throw err
                    })
            }
        }

        ctx.body = posts
    } catch (err) {
        console.log(err)
        throw err
    }
})

router.get("/posts/:id", auth, async (ctx: RouterContext) => {
    try {
        const {id} = ctx.params
        const post = await pool
            .query("SELECT * FROM posts WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!post) ctx.throw(401, "post not found")
        const selectFile = "SELECT * FROM upload WHERE id = $1"
        const image = await pool
            .query(selectFile, [post.image])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        const music = await pool
            .query(selectFile, [post.music])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        post.image = image
        post.music = music
        ctx.body = post
    } catch (err) {
        console.log(err)
        throw err
    }
})

router.post("/posts", auth, async (ctx: RouterContext) => {
    const data = []
    try {
        await pool.query("BEGIN")

        const {title, duration, tempo, genre, price, format} = ctx.request.body
        const files = ctx.request.files
        if (!files || Object.keys(files).length < 2)
            ctx.throw(422, "image and music required")
        if (!title) ctx.throw(402, "title required")
        if (!duration) ctx.throw(402, "duration required")
        if (!tempo) ctx.throw(402, "tempo required")
        if (!genre) ctx.throw(402, "genre required")
        if (!price) ctx.throw(402, "price required")
        if (!format) ctx.throw(402, "format required")

        let temp = files["image"] as FileInput
        const image = await upload(temp)
        data.push(image)
        temp = files["music"] as FileInput
        const music = await upload(temp)
        data.push(music)

        const now = new Date()
        console.log(now)
        const query = {
            text: "INSERT INTO posts(title, created_at, duration, tempo, genre, price, format, image, music) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
            values: [
                title,
                now,
                duration,
                tempo,
                genre,
                price,
                format,
                image?.id,
                music?.id,
            ],
        }
        const info = await pool
            .query(query)
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })

        const post = {
            ...info,
            title,
            created_at: now,
            duration,
            tempo,
            genre,
            price,
            format,
            image,
            music,
        }
        ctx.body = post
        await pool.query("COMMIT")
        console.log("COMMIT")
    } catch (err) {
        for (const file of data) {
            if (file) removeFile(file.url)
        }
        await pool.query("ROLLBACK")
        console.log("ROLLBACK")
        throw err
    }
})

router.delete("/posts/:id", auth, async (ctx: RouterContext) => {
    try {
        await pool.query("BEGIN")

        const {id} = ctx.params
        const post = await pool
            .query("SELECT * FROM posts WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!post) ctx.throw(401, "post not found")
        const queryPost = {
            text: "DELETE FROM posts WHERE id = $1",
            values: [id],
        }
        await pool.query(queryPost)
        const queryFile = "SELECT * FROM upload WHERE id = $1"
        const image = await pool
            .query(queryFile, [post.image])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        const music = await pool
            .query(queryFile, [post.music])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })

        await pool.query("DELETE FROM upload WHERE id = $1", [music.id])
        removeFile(music.url)
        await pool.query("DELETE FROM upload WHERE id = $1", [image.id])
        removeFile(image.url)
        await pool.query("DELETE FROM posts WHERE id = $1", [post.id])

        post.music = music
        post.image = image
        ctx.body = post
        await pool.query("COMMIT")
        console.log("COMMIT")
    } catch (err) {
        console.log(err)
        await pool.query("ROLLBACK")
        throw err
    }
})

router.put("/posts/:id", auth, async (ctx: RouterContext) => {
    try {
        await pool.query("BEGIN")
        const {id} = ctx.params
        const {title, duration, tempo, genre, price, format} = ctx.request.body
        const files = ctx.request.files
        if (
            !title &&
            !duration &&
            !tempo &&
            !genre &&
            !price &&
            !format &&
            !files
        )
            ctx.throw(422, "data required")
        const post = await pool
            .query("SELECT * FROM posts WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!post) ctx.throw(401, "post not found")
        const file = "SELECT * FROM upload WHERE id = $1"
        let image = null,
            music = null
        if (files && Object.keys(files).length > 0) {
            for (const [key] of Object.entries(files)) {
                let temp = files[key] as FileInput

                if (key === "music") {
                    const {url} = await pool
                        .query(file, [post.music])
                        .then((res) => res.rows[0])
                        .catch((err) => {
                            throw err
                        })
                    music = await upload(temp, post.music)
                    removeFile(url)
                } else {
                    const {url} = await pool
                        .query(file, [post.image])
                        .then((res) => res.rows[0])
                        .catch((err) => {
                            throw err
                        })
                    image = await upload(temp, post.image)
                    removeFile(url)
                }
            }
        }

        const args = {
            id,
            created_at: post.created_at,
            title: title ? title : post.title,
            duration: duration ? duration : post.duration,
            tempo: tempo ? tempo : post.tempo,
            genre: genre ? genre : post.genre,
            price: price ? price : post.price,
            format: format ? format : post.format,
            music: {},
            image: {},
        }
        const values = [
            args.title,
            args.duration,
            args.tempo,
            args.genre,
            args.price,
            args.format,
            args.id,
        ]

        await pool.query(
            "UPDATE posts SET title = $1, duration = $2, tempo = $3, genre = $4, price = $5, format = $6 WHERE id = $7",
            values
        )
        console.log(music)

        if (!music) {
            console.log("Request Track")
            music = await pool
                .query(file, [post.music])
                .then((res) => res.rows[0])
                .catch((err) => {
                    throw err
                })
        }
        if (!image) {
            image = await pool
                .query(file, [post.image])
                .then((res) => res.rows[0])
                .catch((err) => {
                    throw err
                })
        }

        args.music = music
        args.image = image
        ctx.body = args
        await pool.query("COMMIT")
    } catch (err) {
        console.log(err)
        await pool.query("ROLLBACK")
        throw err
    }
})

export default router
