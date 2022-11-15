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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferService = void 0;
const entity_clickhouse_service_1 = __importDefault(require("../entity/entity.clickhouse.service"));
const entity_redis_service_1 = __importDefault(require("../entity/entity.redis.service"));
class BufferService {
    constructor() {
        this.isTimerRunning = false;
        this.entityRedisService = new entity_redis_service_1.default();
        this.entityClickhouseService = new entity_clickhouse_service_1.default();
        this.stopInterval = function () {
            clearInterval(this.timer);
            this.isTimerRunning = false;
        };
    }
    checkSizeLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentSize = yield this.entityRedisService.checkSizeOfBuffer();
            console.log({ currentSize });
            console.log('this.getSizeLimit()', this.getSizeLimit());
            console.log('currentSize===this.getSizeLimit()', currentSize === this.getSizeLimit());
            return currentSize === this.getSizeLimit();
        });
    }
    copyToMainDbIfBufferSizeExceeded() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentSize = yield this.entityRedisService.checkSizeOfBuffer();
            if (currentSize === this.getSizeLimit()) {
                console.log('limit size excedeed');
                const entities = yield this.entityRedisService.getAllRecords();
                yield this.entityClickhouseService.save(entities);
                yield this.entityRedisService.removeAllRecords();
                const size = yield this.entityRedisService.checkSizeOfBuffer();
                console.log('size', size);
                this.stopInterval();
                this.startInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const entitiesInBuffer = yield this.entityRedisService.getAllRecords();
                    yield this.entityClickhouseService.save(entitiesInBuffer);
                    yield this.entityRedisService.removeAllRecords();
                    const size = yield this.entityRedisService.checkSizeOfBuffer();
                    console.log('size', size);
                }), this.getTimeoutLimit());
            }
        });
    }
    startInterval(func, timeMs) {
        if (!this.isTimerActive()) {
            this.timer = setInterval(func, timeMs);
            this.isTimerRunning = true;
        }
    }
    ;
    isTimerActive() {
        return this.isTimerRunning !== false;
    }
    ;
    getSizeLimit() {
        const size = process.env.MAX_BUFFER_SIZE;
        return parseInt(size);
    }
    getTimeoutLimit() {
        const limitMs = process.env.MAX_TIME_BUFFER_INTERVAL;
        return parseInt(limitMs) * 1000;
    }
}
exports.BufferService = BufferService;
//# sourceMappingURL=buffer.service.js.map