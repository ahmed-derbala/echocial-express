const packagejson = require('./package.json')
const config = require('./src/config')

module.exports = {
  apps: [
    {
      name: packagejson.name,
      script: 'src/main.js',
      instances: config.app.cluster,
      exec_mode: 'cluster', // Run in cluster mode for better performance
      autorestart: true,
      watch: true,
      ignore_watch: ['node_modules', 'logs'], // Ignore specific directories during watch
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
      env_local: {
        NODE_ENV: 'local',
      },
    },
  ],
};
