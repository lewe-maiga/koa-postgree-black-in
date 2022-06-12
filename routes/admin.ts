import {RouterContext} from "@koa/router"
import router from "../lib/router"
import {sign} from "jsonwebtoken"
import {login, signup} from "../lib/crypto"
import pool from "../database/postsgre"
import {auth} from "../middleware/authenticated"

const mySecretToken = process.env.TOKEN || "secret_token"

router.post("/admin/register", async (ctx: RouterContext) => {
    const {username, password} = ctx.request.body
    const wrongUserPassMsg = "Incorrect username and/or password."
    if (!username) ctx.throw(422, "Username required.")
    if (!password) ctx.throw(422, "Password required.")
    const user = await pool
        .query("SELECT id, password FROM admin WHERE username = $1", [username])
        .then((res) => res.rows[0])
        .catch((err) => {
            throw err
        })

    if (!user) ctx.throw(401, wrongUserPassMsg)
    console.log(user)

    const result = login(user, password)
    if (result) {
        const paylod = {sub: user.id}
        const token = sign(paylod, mySecretToken)
        ctx.body = token
    } else {
        ctx.throw(401, wrongUserPassMsg)
    }
})

router.post("/admin", async (ctx: RouterContext) => {
    const {username, password} = ctx.request.body

    try {
        const user = {
            username,
            password,
        } as {username: string; password: string}
        const result = await signup(user)

        ctx.body = result
    } catch (err) {
        console.log(err)
        throw err
    }
})

export default router
