"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const dotenv = __importStar(require("dotenv"));
const entity_redis_service_1 = __importDefault(require("./entity/entity.redis.service"));
const buffer_service_1 = require("./buffer/buffer.service");
const entity_clickhouse_service_1 = __importDefault(require("./entity/entity.clickhouse.service"));
const utils_1 = require("./utils/utils");
dotenv.config();
const entityRedisService = new entity_redis_service_1.default();
const entityClickhouseService = new entity_clickhouse_service_1.default();
const bufferService = new buffer_service_1.BufferService();
const server = http.createServer((req, res) => {
    let dataToDb;
    req.on('data', (chunk) => {
        dataToDb = Object.assign({}, JSON.parse(chunk));
    });
    req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        yield entityRedisService.save(dataToDb);
        yield bufferService.copyToMainDbIfBufferSizeExceeded();
        res.writeHead(200);
        res.end();
    }));
});
server.listen((0, utils_1.getAppPort)(), () => {
    bufferService.startInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const entitiesInBuffer = yield entityRedisService.getAllRecords();
        if (entitiesInBuffer.length > 0) {
            yield entityClickhouseService.save(entitiesInBuffer);
            yield entityRedisService.removeAllRecords();
            const size = yield entityRedisService.checkSizeOfBuffer();
            console.log('size', size);
        }
    }), (0, utils_1.getTimeoutLimit)());
});
//# sourceMappingURL=server.js.map