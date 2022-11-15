import EntityRedisRepository from "./entity.redis.repository";
export default class EntityRedisService {
    private repository = new EntityRedisRepository();

    public async save(entity: Entity){
        await this.repository.save(entity);
    }

    public async removeAllRecords(): Promise<void>{
        this.repository.clearDb();
    }

    public async checkSizeOfBuffer(): Promise<number>{
        const size= await this.repository.getCurrentSizeOfBuffer();
        return size;
    }
    public async getAllRecords(): Promise<Entity[]>{
        const entitiesStringified:string[]= await this.repository.bulkLoading();
        const entities: Entity[]=[];
        for (let entity of entitiesStringified)
        {
            entities.push(JSON.parse(entity));
        }
        return entities;
    }
} 