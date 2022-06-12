"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var host = process.env.POSTGRES_HOST || "localhost";
var user = process.env.POSTGRES_USER || "postgres";
var database = process.env.POSTGRES_DATABASE || "black_industry";
var password = process.env.POSTGRES_PASSWORD || "2119";
var port = process.env.POSTGRES_PORT
    ? parseInt(process.env.POSTGRES_PORT)
    : 5432;
var pool = new pg_1.Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
});
exports.default = pool;
