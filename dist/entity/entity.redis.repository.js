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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class EntityRedisRepository {
    connectToDb() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${process.env.REDIS_HOST}${process.env.REDIS_PORT}` || 'redis://localhost:6379';
            this.client = (0, redis_1.createClient)({ url });
            this.client.on('error', (err) => console.log('Redis Client Error', err));
            yield this.client.connect();
        });
    }
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connectToDb();
            }
            this.client.FLUSHDB();
        });
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connectToDb();
            }
            yield this.client.set(String(entity.id), JSON.stringify(entity));
        });
    }
    closeDbConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.disconnect();
        });
    }
    getCurrentSizeOfBuffer() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connectToDb();
            }
            let counter = 0;
            try {
                for (var _b = __asyncValues(this.client.scanIterator()), _c; _c = yield _b.next(), !_c.done;) {
                    const key = _c.value;
                    ++counter;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return counter;
        });
    }
    bulkLoading() {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const vals = [];
            if (!this.client) {
                yield this.connectToDb();
            }
            try {
                for (var _b = __asyncValues(this.client.scanIterator()), _c; _c = yield _b.next(), !_c.done;) {
                    const key = _c.value;
                    const val = yield this.client.get(key);
                    vals.push(val);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return vals;
        });
    }
}
exports.default = EntityRedisRepository;
//# sourceMappingURL=entity.redis.repository.js.map