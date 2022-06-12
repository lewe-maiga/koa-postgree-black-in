import {createReadStream, createWriteStream, unlink} from "fs"
import {randomBytes} from "crypto"
import pool from "../database/postsgre"
export type FileInput = {
    name: string
    path: string
    type: string
    size: number
    url?: string
}

export const replace = (file: FileInput) => {
    const regexExt = /\.(mp3|wav|jpg|png|jpeg)/
    const regexName = /[&\/\\#, +()$~%.'":*?<>{}\-]/g
    const regexNumber = /\d+/g
    const name = file?.name.replace(regexExt, "")
    const split = file?.name.split(regexExt)
    const ext = split[1]

    const hashRandomBytes = randomBytes(10).toString("hex")
    const text = name.replace(regexName, "_").replace(regexNumber, "")
    const url = `/upload/${text}_${hashRandomBytes}.${ext}`

    return {
        ...file,
        name,
        url,
    }
}

const saveFile = async (file: FileInput, type = "insert") => {
    try {
        const reader = createReadStream(file.path)
        const writer = createWriteStream(`./public${file.url}`)
        reader.pipe(writer)
    } catch (err) {
        console.log(err)
        throw err
    }
}
export const upload = async (file: FileInput, id?: string) => {
    let data
    if (file) {
        data = replace(file)
    } else {
        return
    }

    if (id) {
        const values = [data.name, data.url, data.type, data.size, id]
        const info = await pool
            .query(
                "UPDATE upload SET name = $1, url = $2, type = $3, size= $4 WHERE id = $5 RETURNING *",
                values
            )
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        console.log(info)

        saveFile(data)
        return info
    } else {
        const values = [data.name, data.url, data.type, data.size]
        const info = await pool
            .query(
                "INSERT INTO upload(name, url, type, size) VALUES($1, $2, $3, $4) RETURNING *",
                values
            )
            .then((res) => res.rows[0])
            .catch((err) => {
                throw err
            })
        console.log(info)

        saveFile(data)
        return info
    }
}

export const removeFile = (file: FileInput | string) => {
    let slug
    if (typeof file === "string") {
        slug = `./public${file}`
    } else {
        const data = replace(file)
        slug = `./public/upload/${data.name}`
    }
    unlink(slug, (err) => {
        if (err) {
            console.error(err)
            return
        } else console.log("Suppression reussie")
    })
}
