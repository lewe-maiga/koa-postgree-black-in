import {RouterContext} from "@koa/router"
import pool from "../database/postsgre"
import router from "../lib/router"
import {auth} from "../middleware/authenticated"

router.get("/description", auth, async (ctx: RouterContext) => {
    const description = await pool
        .query("SELECT * FROM description")
        .then((res) => res.rows[0])
        .catch((err) => {
            throw err
        })
    console.log(description)
    ctx.body = description
})

router.put("/description", auth, async (ctx: RouterContext) => {
    try {
        const {
            heading_main,
            content_main,
            heading_secondary,
            content_secondary,
        } = ctx.request.body
        if (!heading_main) ctx.throw(422, "Heading main required")
        if (!content_main) ctx.throw(422, "content main required")
        if (!heading_secondary) ctx.throw(422, "Heading secondary")
        if (!content_secondary) ctx.throw(422, "Content secondary required")

        const {count} = await pool
            .query("SELECT COUNT(id) as count FROM description")
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })

        console.log(count)

        if (parseInt(count) === 0) {
            await pool.query(
                "INSERT INTO description(heading_main, content_main, heading_secondary, content_secondary) VALUES($1, $2, $3, $4)",
                [
                    heading_main,
                    content_main,
                    heading_secondary,
                    content_secondary,
                ]
            )
        } else {
            await pool.query(
                "UPDATE description SET heading_main = $1, content_main = $2, heading_secondary = $3, content_secondary = $4",
                [
                    heading_main,
                    content_main,
                    heading_secondary,
                    content_secondary,
                ]
            )
        }
        ctx.body = {
            heading_main,
            content_main,
            heading_secondary,
            content_secondary,
        }
    } catch (err) {
        console.log(err)
        throw err
    }
})

export default router
