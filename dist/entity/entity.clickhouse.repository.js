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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@clickhouse/client");
class EntityClickhouseRepository {
    connectToDb() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            this.client = (0, client_1.createClient)({
                host: (_a = `${process.env.CLICKHOUSE_HOST}${process.env.CLICKHOUSE_PORT}`) !== null && _a !== void 0 ? _a : 'http://localhost:8123',
            });
        });
    }
    createTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connectToDb();
            }
            yield this.client.exec({
                query: `
              CREATE TABLE IF NOT EXISTS ${tableName}
              (id UInt64, time String, name String, type String, value String, price UInt64, customerId UInt64, table String)
              ENGINE MergeTree()
              ORDER BY (id)
            `,
                clickhouse_settings: {
                    wait_end_of_query: 1,
                },
            });
        });
    }
    save(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createTable(entities[0].table);
            console.log('entities');
            console.log(entities);
            yield this.client.insert({
                table: entities[0].table,
                values: entities,
                format: 'JSONEachRow',
            });
            // to check if data is successfully inserted into Clickhouse Db
            // const resultSet = await this.client.query({
            //     query: `SELECT * FROM ${process.env.CLICKHOUSE_TABLE}`,
            //     format: 'JSONEachRow',
            //   });
            //   const dataset = await resultSet.json();
            //   console.log('dataset.length',dataset.length);
        });
    }
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.client) {
                yield this.connectToDb();
            }
            yield this.client.query({
                query: `TRUNCATE TABLE ${process.env.CLICKHOUSE_TABLE}`,
            });
            // to check if all data is successfully removed from Clickhouse Db
            //   const resultSet = await this.client.query({
            //     query: `SELECT * FROM ${process.env.CLICKHOUSE_TABLE}`,
            //     format: 'JSONEachRow',
            //   });
            //   const dataset = await resultSet.json();
        });
    }
}
exports.default = EntityClickhouseRepository;
//# sourceMappingURL=entity.clickhouse.repository.js.map