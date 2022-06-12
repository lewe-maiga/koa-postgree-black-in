"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("../lib/router");
var postsgre_1 = require("../database/postsgre");
var authenticated_1 = require("../middleware/authenticated");
var utils_1 = require("../lib/utils");
router_1.default.get("/posts", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, _i, posts_1, post, selectFile, _a, _b, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM posts")
                        .then(function (res) { return res.rows; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 1:
                posts = _c.sent();
                if (!(posts.length !== 0)) return [3 /*break*/, 6];
                _i = 0, posts_1 = posts;
                _c.label = 2;
            case 2:
                if (!(_i < posts_1.length)) return [3 /*break*/, 6];
                post = posts_1[_i];
                selectFile = "SELECT * FROM upload WHERE id = $1";
                _a = post;
                return [4 /*yield*/, postsgre_1.default
                        .query(selectFile, [post.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                _a.image = _c.sent();
                _b = post;
                return [4 /*yield*/, postsgre_1.default
                        .query(selectFile, [post.music])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 4:
                _b.music = _c.sent();
                _c.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 2];
            case 6:
                ctx.body = posts;
                return [3 /*break*/, 8];
            case 7:
                err_1 = _c.sent();
                console.log(err_1);
                throw err_1;
            case 8: return [2 /*return*/];
        }
    });
}); });
router_1.default.get("/posts/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, selectFile, image, music, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = ctx.params.id;
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM posts WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 1:
                post = _a.sent();
                if (!post)
                    ctx.throw(401, "post not found");
                selectFile = "SELECT * FROM upload WHERE id = $1";
                return [4 /*yield*/, postsgre_1.default
                        .query(selectFile, [post.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                image = _a.sent();
                return [4 /*yield*/, postsgre_1.default
                        .query(selectFile, [post.music])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                music = _a.sent();
                post.image = image;
                post.music = music;
                ctx.body = post;
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                console.log(err_2);
                throw err_2;
            case 5: return [2 /*return*/];
        }
    });
}); });
router_1.default.post("/posts", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var data, _a, title, duration, tempo, genre, price, format, files, temp, image, music, now, query, info, post, err_3, _i, data_1, file;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                data = [];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 9]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 2:
                _b.sent();
                _a = ctx.request.body, title = _a.title, duration = _a.duration, tempo = _a.tempo, genre = _a.genre, price = _a.price, format = _a.format;
                files = ctx.request.files;
                if (!files || Object.keys(files).length < 2)
                    ctx.throw(422, "image and music required");
                if (!title)
                    ctx.throw(402, "title required");
                if (!duration)
                    ctx.throw(402, "duration required");
                if (!tempo)
                    ctx.throw(402, "tempo required");
                if (!genre)
                    ctx.throw(402, "genre required");
                if (!price)
                    ctx.throw(402, "price required");
                if (!format)
                    ctx.throw(402, "format required");
                temp = files["image"];
                return [4 /*yield*/, (0, utils_1.upload)(temp)];
            case 3:
                image = _b.sent();
                data.push(image);
                temp = files["music"];
                return [4 /*yield*/, (0, utils_1.upload)(temp)];
            case 4:
                music = _b.sent();
                data.push(music);
                now = new Date();
                console.log(now);
                query = {
                    text: "INSERT INTO posts(title, created_at, duration, tempo, genre, price, format, image, music) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
                    values: [
                        title,
                        now,
                        duration,
                        tempo,
                        genre,
                        price,
                        format,
                        image === null || image === void 0 ? void 0 : image.id,
                        music === null || music === void 0 ? void 0 : music.id,
                    ],
                };
                return [4 /*yield*/, postsgre_1.default
                        .query(query)
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 5:
                info = _b.sent();
                post = __assign(__assign({}, info), { title: title, created_at: now, duration: duration, tempo: tempo, genre: genre, price: price, format: format, image: image, music: music });
                ctx.body = post;
                return [4 /*yield*/, postsgre_1.default.query("COMMIT")];
            case 6:
                _b.sent();
                console.log("COMMIT");
                return [3 /*break*/, 9];
            case 7:
                err_3 = _b.sent();
                for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                    file = data_1[_i];
                    if (file)
                        (0, utils_1.removeFile)(file.url);
                }
                return [4 /*yield*/, postsgre_1.default.query("ROLLBACK")];
            case 8:
                _b.sent();
                console.log("ROLLBACK");
                throw err_3;
            case 9: return [2 /*return*/];
        }
    });
}); });
router_1.default.delete("/posts/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, queryPost, queryFile, image, music, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 12]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 1:
                _a.sent();
                id = ctx.params.id;
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM posts WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                post = _a.sent();
                if (!post)
                    ctx.throw(401, "post not found");
                queryPost = {
                    text: "DELETE FROM posts WHERE id = $1",
                    values: [id],
                };
                return [4 /*yield*/, postsgre_1.default.query(queryPost)];
            case 3:
                _a.sent();
                queryFile = "SELECT * FROM upload WHERE id = $1";
                return [4 /*yield*/, postsgre_1.default
                        .query(queryFile, [post.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 4:
                image = _a.sent();
                return [4 /*yield*/, postsgre_1.default
                        .query(queryFile, [post.music])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 5:
                music = _a.sent();
                return [4 /*yield*/, postsgre_1.default.query("DELETE FROM upload WHERE id = $1", [music.id])];
            case 6:
                _a.sent();
                (0, utils_1.removeFile)(music.url);
                return [4 /*yield*/, postsgre_1.default.query("DELETE FROM upload WHERE id = $1", [image.id])];
            case 7:
                _a.sent();
                (0, utils_1.removeFile)(image.url);
                return [4 /*yield*/, postsgre_1.default.query("DELETE FROM posts WHERE id = $1", [post.id])];
            case 8:
                _a.sent();
                post.music = music;
                post.image = image;
                ctx.body = post;
                return [4 /*yield*/, postsgre_1.default.query("COMMIT")];
            case 9:
                _a.sent();
                console.log("COMMIT");
                return [3 /*break*/, 12];
            case 10:
                err_4 = _a.sent();
                console.log(err_4);
                return [4 /*yield*/, postsgre_1.default.query("ROLLBACK")];
            case 11:
                _a.sent();
                throw err_4;
            case 12: return [2 /*return*/];
        }
    });
}); });
router_1.default.put("/posts/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, duration, tempo, genre, price, format, files, post, file, image, music, _i, _b, key, temp, url, url, args, values, err_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 17, , 19]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 1:
                _c.sent();
                id = ctx.params.id;
                _a = ctx.request.body, title = _a.title, duration = _a.duration, tempo = _a.tempo, genre = _a.genre, price = _a.price, format = _a.format;
                files = ctx.request.files;
                if (!title &&
                    !duration &&
                    !tempo &&
                    !genre &&
                    !price &&
                    !format &&
                    !files)
                    ctx.throw(422, "data required");
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM posts WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                post = _c.sent();
                if (!post)
                    ctx.throw(401, "post not found");
                file = "SELECT * FROM upload WHERE id = $1";
                image = null, music = null;
                if (!(files && Object.keys(files).length > 0)) return [3 /*break*/, 10];
                _i = 0, _b = Object.entries(files);
                _c.label = 3;
            case 3:
                if (!(_i < _b.length)) return [3 /*break*/, 10];
                key = _b[_i][0];
                temp = files[key];
                if (!(key === "music")) return [3 /*break*/, 6];
                return [4 /*yield*/, postsgre_1.default
                        .query(file, [post.music])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 4:
                url = (_c.sent()).url;
                return [4 /*yield*/, (0, utils_1.upload)(temp, post.music)];
            case 5:
                music = _c.sent();
                (0, utils_1.removeFile)(url);
                return [3 /*break*/, 9];
            case 6: return [4 /*yield*/, postsgre_1.default
                    .query(file, [post.image])
                    .then(function (res) { return res.rows[0]; })
                    .catch(function (err) {
                    throw err;
                })];
            case 7:
                url = (_c.sent()).url;
                return [4 /*yield*/, (0, utils_1.upload)(temp, post.image)];
            case 8:
                image = _c.sent();
                (0, utils_1.removeFile)(url);
                _c.label = 9;
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10:
                args = {
                    id: id,
                    created_at: post.created_at,
                    title: title ? title : post.title,
                    duration: duration ? duration : post.duration,
                    tempo: tempo ? tempo : post.tempo,
                    genre: genre ? genre : post.genre,
                    price: price ? price : post.price,
                    format: format ? format : post.format,
                    music: {},
                    image: {},
                };
                values = [
                    args.title,
                    args.duration,
                    args.tempo,
                    args.genre,
                    args.price,
                    args.format,
                    args.id,
                ];
                return [4 /*yield*/, postsgre_1.default.query("UPDATE posts SET title = $1, duration = $2, tempo = $3, genre = $4, price = $5, format = $6 WHERE id = $7", values)];
            case 11:
                _c.sent();
                console.log(music);
                if (!!music) return [3 /*break*/, 13];
                console.log("Request Track");
                return [4 /*yield*/, postsgre_1.default
                        .query(file, [post.music])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 12:
                music = _c.sent();
                _c.label = 13;
            case 13:
                if (!!image) return [3 /*break*/, 15];
                return [4 /*yield*/, postsgre_1.default
                        .query(file, [post.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 14:
                image = _c.sent();
                _c.label = 15;
            case 15:
                args.music = music;
                args.image = image;
                ctx.body = args;
                return [4 /*yield*/, postsgre_1.default.query("COMMIT")];
            case 16:
                _c.sent();
                return [3 /*break*/, 19];
            case 17:
                err_5 = _c.sent();
                console.log(err_5);
                return [4 /*yield*/, postsgre_1.default.query("ROLLBACK")];
            case 18:
                _c.sent();
                throw err_5;
            case 19: return [2 /*return*/];
        }
    });
}); });
exports.default = router_1.default;
