# express-starter
a clean project to start an express app faster. This made using node v18

# features
- javascript with nodejs v18 and express 5
- everything is configurable in /configs
- clean architecture
- pm2 
- socketio
- logs: winston (file, console, mongo) with memory infos 
- mongoose
- custom json requests logs with morgan and winston
- cluster: configurable in configs
- load config file based on NODE_ENV
- api limiter, helmet, compression
- use_strict: true by default
- --max-old-space-size=32000


# first run: set config.js, install modules with --force, open the project in vscode and run. Default port = 5000, can be changed in /src/configs/config.js
```
npm run start:first-time
```

# postman collection
you can import postman collection located in
```
docs/express-starter.postman_collection.json
```

# swagger
```
http://127.0.0.1:5000/swagger
```