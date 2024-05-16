module.exports = {
  apps: [
    {
      name: 'stock-db-ts',
      // instances: 'max',
      // exec_mode: 'cluster',
      cwd: './',
      script: 'npm',
      args: 'run start:ts',
      max_restarts: 3,
      // watch: ['./src'],
      env: {},
      out_file: '/var/log/stock-db/out.log',
      err_file: '/var/log/stock-db/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
    {
      name: 'stock-db',
      cwd: './',
      script: 'npm',
      args: 'start',
      max_restarts: 3,
      watch: ['./dist'],
      ignore_watch: ['dist/data'],
      env: {},
      out_file: '/var/log/stock-db/out.log',
      err_file: '/var/log/stock-db/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
    {
      name: 'test',
      script: 'npm',
      args: 'test',
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
}
