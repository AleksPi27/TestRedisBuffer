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
const entity_redis_repository_1 = __importDefault(require("./entity.redis.repository"));
class EntityRedisService {
    constructor() {
        this.repository = new entity_redis_repository_1.default();
    }
    save(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.repository.save(entity);
        });
    }
    removeAllRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            this.repository.clearDb();
        });
    }
    checkSizeOfBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            const size = yield this.repository.getCurrentSizeOfBuffer();
            return size;
        });
    }
    getAllRecords() {
        return __awaiter(this, void 0, void 0, function* () {
            const entitiesStringified = yield this.repository.bulkLoading();
            const entities = [];
            for (let entity of entitiesStringified) {
                entities.push(JSON.parse(entity));
            }
            return entities;
        });
    }
}
exports.default = EntityRedisService;
//# sourceMappingURL=entity.redis.service.js.map