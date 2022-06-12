import koaBody = require("koa-body")
import * as Koa from "koa"
import * as serve from "koa-static"
import * as Cors from "@koa/cors"
import * as dotenv from "dotenv"
import {error} from "../middleware/error"
import adminRoutes from "../routes/admin"
import postsRoutes from "../routes/posts"
import uploadRoutes from "../routes/upload"
import artistsRoutes from "../routes/artists"
import descriptionRoutes from "../routes/description"

const app = new Koa()
dotenv.config()
const port = process.env.PORT || 3000

app.use(serve("./public"))

app.use(
    koaBody({
        multipart: true,
        formidable: {
            keepExtensions: true,
        },
    })
)

app.use(Cors())
app.use(error)

app.use(adminRoutes.routes())
app.use(postsRoutes.routes())
app.use(uploadRoutes.routes())
app.use(artistsRoutes.routes())
app.use(descriptionRoutes.routes())

app.listen(port, () => {
    console.log(`Acceder au server: http://localhost:${port}`)
})
