import * as http from 'http';
import * as dotenv from 'dotenv';
import EntityRedisService from './entity/entity.redis.service';
import { BufferService } from './buffer/buffer.service';
import EntityClickhouseService from './entity/entity.clickhouse.service';
import {getTimeoutLimit, getAppPort} from './utils/utils';
dotenv.config();
const entityRedisService = new EntityRedisService();
const entityClickhouseService = new EntityClickhouseService();
const bufferService = new BufferService();

const server = http.createServer((req, res)=>{
let dataToDb: Entity;

req.on('data',  (chunk)=>{
    dataToDb = Object.assign({}, JSON.parse(chunk));
});

req.on('end', async ()=>{
    await entityRedisService.save(dataToDb);
    await bufferService.copyToMainDbIfBufferSizeExceeded();
    res.writeHead(200);
    res.end();
})

})

server.listen(getAppPort(), () =>{
    bufferService.startInterval(async () => {
        const entitiesInBuffer = await entityRedisService.getAllRecords();
        if (entitiesInBuffer.length>0){
            await entityClickhouseService.save(entitiesInBuffer);
            await entityRedisService.removeAllRecords();
            const size = await entityRedisService.checkSizeOfBuffer();
            console.log('size', size);
        }
    }, getTimeoutLimit());
}
);