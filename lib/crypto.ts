import {randomBytes, scryptSync, timingSafeEqual} from "crypto"
import pool from "../database/postsgre"

type User = {
    id: number
    username: string
    password: string
}
export const signup = async ({
    username,
    password,
}: {
    username: string
    password: string
}) => {
    const salt = randomBytes(16).toString("hex")
    const hash = scryptSync(password, salt, 64).toString("hex")

    console.log("hash", hash)
    const hashedPassword = `${salt}:${hash}`
    console.log("hash with salt", hashedPassword.length)

    const admin = await pool
        .query(
            "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *",
            [username, hashedPassword]
        )
        .then((res) => res.rows[0])
        .catch((err) => {
            throw err
        })

    console.log(admin)

    return {
        id: admin.id,
        username: admin.username,
        password: admin.password,
    }
}
export const login = ({password: pass}: User, password: string) => {
    console.log(pass.length)
    const [salt, key] = pass.split(":")
    const hashBuffer = scryptSync(password, salt, 64)
    const keyBuffer = Buffer.from(key, "hex")
    const match = timingSafeEqual(hashBuffer, keyBuffer)
    console.log("match", match)
    if (match) {
        return true
    } else {
        return false
    }
}
