import { createClient } from 'redis';
export default class EntityRedisRepository {
    private client;

    public async connectToDb() {
        const url = `${process.env.REDIS_HOST}${process.env.REDIS_PORT}` || 'redis://localhost:6379';
        this.client = createClient({url});
        this.client.on('error', (err) => console.log('Redis Client Error', err));
        await this.client.connect();
    }

    public async clearDb(){
        if (!this.client) {
            await this.connectToDb();
        }
        this.client.FLUSHDB()
    } 

    public async save(entity: Entity) {
        if (!this.client) {
            await this.connectToDb();
        }
        await this.client.set(String(entity.id), JSON.stringify(entity));
    }

    public async closeDbConnection() {
        await this.client.disconnect();
    }

    public async getCurrentSizeOfBuffer(): Promise<number> {
        if (!this.client) {
            await this.connectToDb();
        }
        let counter: number = 0;
        for await (const key of this.client.scanIterator()) {
            ++counter;
        }
        return counter;
    }

    public async bulkLoading(): Promise<string[]> {
        const vals = [];
        if (!this.client) {
            await this.connectToDb();
        }
        for await (const key of this.client.scanIterator()) {
            const val = await this.client.get(key);
            vals.push(val);
        }
        return vals;
    }
}