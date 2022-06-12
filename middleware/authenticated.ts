import {verify} from "jsonwebtoken"
import {Next} from "koa"
const mySecretToken = process.env.TOKEN || "secret_token"

export const auth = async (ctx: any, next: Next) => {
    if (!ctx.headers.authorization) ctx.throw(403, "No token.")

    const token = ctx.headers.authorization.split(" ")[1]

    try {
        ctx.request.jwtPayload = verify(token, mySecretToken)
    } catch (err: any) {
        ctx.throw(err.status || 403, err.text)
    }

    await next()
}
