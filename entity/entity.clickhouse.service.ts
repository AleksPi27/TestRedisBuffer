import EntityClickhouseRepository from "./entity.clickhouse.repository";

export default class EntityClickhouseService {
    private repository = new EntityClickhouseRepository();

    public async save(entities: Entity[]){
        await this.repository.save(entities);
    }
    public async remove(){
        await this.repository.remove();
    }
} 