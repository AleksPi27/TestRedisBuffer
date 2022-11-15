# TestRedisBuffer
This is a test task for Admon.ai with a goal to implement Redis buffer between a web server and ClickHouse database

To start the app, please, do the following:
  1) Run "git clone <url_of_this_repo>";
  2) Be ensured that you have installed Redis for buffer purpose. In any case, you can run it in Docker using "docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest";
  3) Be ensured that you have installed Clickhouse as a main DB on machine where you want to run it on. In any case, you can run it in Docker using
  4) Run "npm install" in root directory of your project;
  5) You can modify .env to customize your Redis host, port, buffer size, time limits;
  6) After you had set up the project you can run "npm run start" to start it;
  7) The server accepts POST requests with the following body in JSON format:
    {
    "id": 1,
    "time": "12-11-2022:11-27-37",
    "name": "nameeee",
    "type": "model",
    "value": "val",
    "price": 123,
    "customerId": 2,
    "table": "example"
  }
  
  8) Field "table" can be used to specify what Clickhouse database you want to send current batch of data to (if other objects and buffer have another value of "table" their values will be ignored).
