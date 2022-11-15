import EntityClickhouseService from "../entity/entity.clickhouse.service";
import EntityRedisService from "../entity/entity.redis.service";
import {getTimeoutLimit, getSizeLimit} from './../utils/utils';

export class BufferService {
    private isTimerRunning: boolean = false;
    private timer;
    private entityRedisService = new EntityRedisService();
    private entityClickhouseService = new EntityClickhouseService();

    public async copyToMainDbIfBufferSizeExceeded(){
        const currentSize = await this.entityRedisService.checkSizeOfBuffer()
        if (currentSize===getSizeLimit()){
            console.log('limit size excedeed');
            const entities = await this.entityRedisService.getAllRecords();
            await this.entityClickhouseService.save(entities);
            await this.entityRedisService.removeAllRecords();
            const size = await this.entityRedisService.checkSizeOfBuffer();
            console.log('size', size);
            this.stopInterval();
            this.startInterval(async () => {
                const entitiesInBuffer = await this.entityRedisService.getAllRecords();
                if (entities.length>0){
                    await this.entityClickhouseService.save(entitiesInBuffer);
                    await this.entityRedisService.removeAllRecords();
                    const size = await this.entityRedisService.checkSizeOfBuffer();
                    console.log('size', size);
                }
            }, getTimeoutLimit());
        }
    }

    public startInterval(func: any, timeMs: number) {
        if (!this.isTimerActive())
        {
            this.timer = setInterval(func, timeMs);
            this.isTimerRunning = true;
        }
    };

    public stopInterval = function () {
        clearInterval(this.timer);
        this.isTimerRunning = false;
    };

    private isTimerActive() {
        return this.isTimerRunning !== false;
    };
}