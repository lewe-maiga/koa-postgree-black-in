"use strict";
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
exports.login = exports.signup = void 0;
var crypto_1 = require("crypto");
var postsgre_1 = require("../database/postsgre");
var signup = function (_a) {
    var username = _a.username, password = _a.password;
    return __awaiter(void 0, void 0, void 0, function () {
        var salt, hash, hashedPassword, admin;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    salt = (0, crypto_1.randomBytes)(16).toString("hex");
                    hash = (0, crypto_1.scryptSync)(password, salt, 64).toString("hex");
                    console.log("hash", hash);
                    hashedPassword = "".concat(salt, ":").concat(hash);
                    console.log("hash with salt", hashedPassword.length);
                    return [4 /*yield*/, postsgre_1.default
                            .query("INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *", [username, hashedPassword])
                            .then(function (res) { return res.rows[0]; })
                            .catch(function (err) {
                            throw err;
                        })];
                case 1:
                    admin = _b.sent();
                    console.log(admin);
                    return [2 /*return*/, {
                            id: admin.id,
                            username: admin.username,
                            password: admin.password,
                        }];
            }
        });
    });
};
exports.signup = signup;
var login = function (_a, password) {
    var pass = _a.password;
    console.log(pass.length);
    var _b = pass.split(":"), salt = _b[0], key = _b[1];
    var hashBuffer = (0, crypto_1.scryptSync)(password, salt, 64);
    var keyBuffer = Buffer.from(key, "hex");
    var match = (0, crypto_1.timingSafeEqual)(hashBuffer, keyBuffer);
    console.log("match", match);
    if (match) {
        return true;
    }
    else {
        return false;
    }
};
exports.login = login;
