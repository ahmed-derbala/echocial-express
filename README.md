# echocial
The backend of echocial, the social echo
# features
- javascript with express 5
- everything is configurable in /config
- clean architecture
- pm2 
- socketio
- logs: winston (file, console, mongo) with memory (in GB) 
- mongoose
- custom json requests logs with morgan and winston
- cluster: configurable in config
- load config file based on NODE_ENV
- api limiter, helmet, compression
- use_strict: true by default
- --max-old-space-size=32000
- prettier before commit and push (npm run push -- "commit message")


# first time: set config.js, install modules and run. Default port = 5000, can be changed in /src/config/config.js
```
npm run start:first-time
```

# postman collection
you can import postman collection located in
```
docs/echocial.postman_collection.json
```

# swagger
```
http://127.0.0.1:5000/swagger
```