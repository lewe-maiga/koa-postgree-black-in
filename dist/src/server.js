"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var koaBody = require("koa-body");
var Koa = require("koa");
var serve = require("koa-static");
var Cors = require("@koa/cors");
var dotenv = require("dotenv");
var error_1 = require("../middleware/error");
var admin_1 = require("../routes/admin");
var posts_1 = require("../routes/posts");
var upload_1 = require("../routes/upload");
var artists_1 = require("../routes/artists");
var description_1 = require("../routes/description");
var app = new Koa();
dotenv.config();
var port = process.env.PORT || 3000;
app.use(serve("./public"));
app.use(koaBody({
    multipart: true,
    formidable: {
        keepExtensions: true,
    },
}));
app.use(Cors());
app.use(error_1.error);
app.use(admin_1.default.routes());
app.use(posts_1.default.routes());
app.use(upload_1.default.routes());
app.use(artists_1.default.routes());
app.use(description_1.default.routes());
app.listen(port, function () {
    console.log("Acceder au server: http://localhost:".concat(port));
});
