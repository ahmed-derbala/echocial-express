# echocial
The backend of echocial, the social echo
# features
- javascript with express 5
- everything is configurable in src/config
- clean architecture
- pm2 
- socketio
- logs: custom json requests logs with morgan and winston (file, console, mongo) with memory (in GB) 
- mongoose
- cluster: configurable in config
- api limiter, helmet, compression
- --max-old-space-size=32000
- prettier before commit and push (npm run push -- "commit message")
- postman collection


# first time: set config.js, install modules and run. Default port = 5000, can be changed in /src/config/config.js
```
npm run first-time
```

# postman collection
you can import postman collection located in
```
docs/echocial.postman_collection.json
```

# swagger
```
http://127.0.0.1:5001/swagger
```

# update packages: please create /backups directory to keep backup of current packages
```
npm run update
```

# restore packages: restore backup already saved in /backups
```
npm run restore
```

# clean packages: delete and reinstall packages
```
npm run clean
```