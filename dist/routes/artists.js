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
var authenticated_1 = require("../middleware/authenticated");
var utils_1 = require("../lib/utils");
var postsgre_1 = require("../database/postsgre");
router_1.default.get("/artists", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var artists, _i, artists_1, artist, image, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM artists")
                        .then(function (res) { return res.rows; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 1:
                artists = _a.sent();
                if (artists.length === 0) {
                    ctx.body = artists;
                    return [2 /*return*/];
                }
                _i = 0, artists_1 = artists;
                _a.label = 2;
            case 2:
                if (!(_i < artists_1.length)) return [3 /*break*/, 5];
                artist = artists_1[_i];
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM upload WHERE id = $1", [artist.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                image = _a.sent();
                artist.image = image;
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                ctx.body = artists;
                return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                console.log(err_1);
                throw err_1;
            case 7: return [2 /*return*/];
        }
    });
}); });
router_1.default.get("/artists/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, artist, image, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = ctx.params.id;
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM artists WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 1:
                artist = _a.sent();
                if (!artist)
                    ctx.throw(401, "artist not found");
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM upload WHERE id = $1", [artist.image])
                        .then(function (res) { return res.rows; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                image = _a.sent();
                artist.image = image;
                ctx.body = artist;
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                throw err_2;
            case 4: return [2 /*return*/];
        }
    });
}); });
router_1.default.post("/artists", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var file, pseudo, files, temp, image, id, artist, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 7]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 1:
                _a.sent();
                pseudo = ctx.request.body.pseudo;
                if (!pseudo)
                    ctx.throw(422, "pseudo required");
                files = ctx.request.files;
                if (!files)
                    ctx.throw(422, "image required");
                temp = files["image"];
                return [4 /*yield*/, (0, utils_1.upload)(temp)];
            case 2:
                image = _a.sent();
                file = image;
                return [4 /*yield*/, postsgre_1.default
                        .query("INSERT INTO artists(pseudo, image) VALUES($1, $2) RETURNING id", [pseudo, image === null || image === void 0 ? void 0 : image.id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                id = (_a.sent()).id;
                artist = {
                    id: id,
                    pseudo: pseudo,
                    image: image,
                };
                ctx.body = artist;
                return [4 /*yield*/, postsgre_1.default.query("COMMIT")];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                err_3 = _a.sent();
                console.log(err_3);
                if (file)
                    (0, utils_1.removeFile)(file.url);
                return [4 /*yield*/, postsgre_1.default.query("ROLLBACK")];
            case 6:
                _a.sent();
                console.log("ROLLBACK");
                throw err_3;
            case 7: return [2 /*return*/];
        }
    });
}); });
router_1.default.put("/artists/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, pseudo, files, artist, image, args, file, url, temp, file, picture, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 12]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 1:
                _a.sent();
                id = ctx.params.id;
                pseudo = ctx.request.body.pseudo;
                files = ctx.request.files;
                if (!pseudo && !files)
                    ctx.throw(422, "data required");
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM artists WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                artist = _a.sent();
                if (!artist)
                    ctx.throw(401, "artist not found");
                image = null;
                args = {
                    id: id,
                    pseudo: pseudo ? pseudo : artist.pseudo,
                };
                return [4 /*yield*/, postsgre_1.default.query("UPDATE artists SET pseudo = $1 WHERE id = $2", [
                        args.pseudo,
                        id,
                    ])];
            case 3:
                _a.sent();
                if (!(files && Object.keys(files).length === 1)) return [3 /*break*/, 6];
                file = "SELECT * FROM upload WHERE id = $1";
                return [4 /*yield*/, postsgre_1.default
                        .query(file, [artist.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 4:
                url = (_a.sent()).url;
                temp = files["image"];
                return [4 /*yield*/, (0, utils_1.upload)(temp, artist.image)];
            case 5:
                image = _a.sent();
                (0, utils_1.removeFile)(url);
                console.log("With file");
                artist.image = image;
                return [3 /*break*/, 8];
            case 6:
                file = "SELECT * FROM upload WHERE id = $1";
                return [4 /*yield*/, postsgre_1.default
                        .query(file, [artist.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 7:
                picture = _a.sent();
                console.log("Without file");
                artist.image = picture;
                _a.label = 8;
            case 8:
                ctx.body = __assign(__assign({}, artist), { pseudo: args.pseudo });
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
                console.log("ROLLBACK");
                throw err_4;
            case 12: return [2 /*return*/];
        }
    });
}); });
router_1.default.delete("/artists/:id", authenticated_1.auth, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, artist, image, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 9]);
                return [4 /*yield*/, postsgre_1.default.query("BEGIN")];
            case 1:
                _a.sent();
                id = ctx.params.id;
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM artists WHERE id = $1", [id])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 2:
                artist = _a.sent();
                if (!artist)
                    ctx.throw(401, "artist not found");
                return [4 /*yield*/, postsgre_1.default
                        .query("SELECT * FROM upload WHERE id = $1", [artist.image])
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                image = _a.sent();
                console.log(image);
                return [4 /*yield*/, postsgre_1.default.query("DELETE FROM artists WHERE id = $1", [id])];
            case 4:
                _a.sent();
                return [4 /*yield*/, postsgre_1.default.query("DELETE FROM upload WHERE id = $1", [artist.image])];
            case 5:
                _a.sent();
                (0, utils_1.removeFile)(image.url);
                artist.image = image;
                return [4 /*yield*/, postsgre_1.default.query("COMMIT")];
            case 6:
                _a.sent();
                console.log("COMMIT");
                ctx.body = artist;
                return [3 /*break*/, 9];
            case 7:
                err_5 = _a.sent();
                console.log(err_5);
                return [4 /*yield*/, postsgre_1.default.query("ROLLBACK")];
            case 8:
                _a.sent();
                console.log("ROLLBACK");
                throw err_5;
            case 9: return [2 /*return*/];
        }
    });
}); });
exports.default = router_1.default;
