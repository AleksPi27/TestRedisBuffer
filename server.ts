import * as http from 'http';
import * as dotenv from 'dotenv';
dotenv.config();

console.log(process.env.PORT);

function getPort(): number {
    const port = process.env.PORT || "3000";
    return parseInt(port);
}


const server = http.createServer((req, res)=>{
const {headers, method, url} = req;
let dataToDb: Entity;
req.on('data', (chunk)=>{
    dataToDb = Object.assign({}, JSON.parse(chunk));
});
req.on('end', ()=>{
    //write data to REDIS
    res.writeHead(200);
    res.end();
})
}).listen(getPort())