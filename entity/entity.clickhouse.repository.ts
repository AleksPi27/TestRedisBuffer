import { createClient } from '@clickhouse/client'
import { HighlightSpanKind, visitParameterList } from 'typescript';
export default class EntityClickhouseRepository {
    private client;

    private async connectToDb (){
        this.client = createClient({
            host: `${process.env.CLICKHOUSE_HOST}${process.env.CLICKHOUSE_PORT}` ?? 'http://localhost:8123',
        });
    }

    private async createTable(tableName: string){
        if (!this.client){
           await this.connectToDb();
        }
        await this.client.exec({
            query: `
              CREATE TABLE IF NOT EXISTS ${tableName}
              (id UInt64, time String, name String, type String, value String, price UInt64, customerId UInt64, table String)
              ENGINE MergeTree()
              ORDER BY (id)
            `,
            clickhouse_settings: {
              wait_end_of_query: 1,
            },
          })
    }

    public async save(entities: Entity[]){
        await this.createTable(entities[0].table);
        console.log('entities');
        console.log(entities);
        await this.client.insert({
            table: entities[0].table,
            values: entities,
            format: 'JSONEachRow',
        });
        const resultSet = await this.client.query({
            query: `SELECT * FROM ${process.env.CLICKHOUSE_TABLE}`,
            format: 'JSONEachRow',
          });
          const dataset = await resultSet.json();
          console.log('dataset.length',dataset.length);
    }
    public async remove(){
        if (!this.client){
            await this.connectToDb();
         }
        await this.client.query({
            query: `TRUNCATE TABLE ${process.env.CLICKHOUSE_TABLE}`,
          });
        //   const resultSet = await this.client.query({
        //     query: `SELECT * FROM ${process.env.CLICKHOUSE_TABLE}`,
        //     format: 'JSONEachRow',
        //   });
        //   const dataset = await resultSet.json();
    }
}