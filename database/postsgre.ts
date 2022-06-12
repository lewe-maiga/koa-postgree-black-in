import {Pool} from "pg"

const host = process.env.POSTGRES_HOST || "localhost"
const user = process.env.POSTGRES_USER || "postgres"
const database = process.env.POSTGRES_DATABASE || "black_industry"
const password = process.env.POSTGRES_PASSWORD || "2119"
const port = process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT)
    : 5432

const pool = new Pool({
    user,
    host,
    database,
    password,
    port,
})

export default pool
