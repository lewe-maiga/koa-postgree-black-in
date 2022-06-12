import router from "../lib/router"

import {RouterContext} from "@koa/router"
import pool from "../database/postsgre"
import {auth} from "../middleware/authenticated"

router.get("/upload", auth, async (ctx: RouterContext) => {
    try {
        const files = await pool
            .query("SELECT * FROM upload")
            .then((res) => res.rows)
            .catch((err) => {
                throw err
            })
        ctx.body = files
    } catch (err) {
        console.log(err)
        throw err
    }
})

router.get("/upload/:id", auth, async (ctx: RouterContext) => {
    try {
        const {id} = ctx.params
        const file = await pool
            .query("SELECT * FROM upload WHERE id = $1", [id])
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        if (!file) ctx.throw(401, "file not found")
        ctx.body = file
    } catch (err) {
        console.log(err)
        throw err
    }
})

export default router
