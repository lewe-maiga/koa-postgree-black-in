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
exports.removeFile = exports.upload = exports.replace = void 0;
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var postsgre_1 = require("../database/postsgre");
var replace = function (file) {
    var regexExt = /\.(mp3|wav|jpg|png|jpeg)/;
    var regexName = /[&\/\\#, +()$~%.'":*?<>{}\-]/g;
    var regexNumber = /\d+/g;
    var name = file === null || file === void 0 ? void 0 : file.name.replace(regexExt, "");
    var split = file === null || file === void 0 ? void 0 : file.name.split(regexExt);
    var ext = split[1];
    var hashRandomBytes = (0, crypto_1.randomBytes)(10).toString("hex");
    var text = name.replace(regexName, "_").replace(regexNumber, "");
    var url = "/upload/".concat(text, "_").concat(hashRandomBytes, ".").concat(ext);
    return __assign(__assign({}, file), { name: name, url: url });
};
exports.replace = replace;
var saveFile = function (file, type) {
    if (type === void 0) { type = "insert"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var reader, writer;
        return __generator(this, function (_a) {
            try {
                reader = (0, fs_1.createReadStream)(file.path);
                writer = (0, fs_1.createWriteStream)("./public".concat(file.url));
                reader.pipe(writer);
            }
            catch (err) {
                console.log(err);
                throw err;
            }
            return [2 /*return*/];
        });
    });
};
var upload = function (file, id) { return __awaiter(void 0, void 0, void 0, function () {
    var data, values, info, values, info;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (file) {
                    data = (0, exports.replace)(file);
                }
                else {
                    return [2 /*return*/];
                }
                if (!id) return [3 /*break*/, 2];
                values = [data.name, data.url, data.type, data.size, id];
                return [4 /*yield*/, postsgre_1.default
                        .query("UPDATE upload SET name = $1, url = $2, type = $3, size= $4 WHERE id = $5 RETURNING *", values)
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 1:
                info = _a.sent();
                console.log(info);
                saveFile(data);
                return [2 /*return*/, info];
            case 2:
                values = [data.name, data.url, data.type, data.size];
                return [4 /*yield*/, postsgre_1.default
                        .query("INSERT INTO upload(name, url, type, size) VALUES($1, $2, $3, $4) RETURNING *", values)
                        .then(function (res) { return res.rows[0]; })
                        .catch(function (err) {
                        throw err;
                    })];
            case 3:
                info = _a.sent();
                console.log(info);
                saveFile(data);
                return [2 /*return*/, info];
        }
    });
}); };
exports.upload = upload;
var removeFile = function (file) {
    var slug;
    if (typeof file === "string") {
        slug = "./public".concat(file);
    }
    else {
        var data = (0, exports.replace)(file);
        slug = "./public/upload/".concat(data.name);
    }
    (0, fs_1.unlink)(slug, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        else
            console.log("Suppression reussie");
    });
};
exports.removeFile = removeFile;
