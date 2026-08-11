module.exports = {
  apps: [
    {
      name: 'stock-server-ts',
      // instances: 'max',
      // exec_mode: 'cluster',
      cwd: './',
      script: 'npm',
      args: 'run start:dev',
      max_restarts: 3,
      // watch: ['./src'],
      env: {},
      out_file: '/var/log/stock-server/out.log',
      err_file: '/var/log/stock-server/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    },
    {
      name: 'stock-server',
      cwd: './',
      script: 'dist/main.js',
      max_restarts: 5,
      watch: false,
      env: {
        AWST_ENV: 'tx',
        NODE_ENV: 'production',
      },
      out_file: '/var/log/stock-server/out.log',
      err_file: '/var/log/stock-server/err.log',
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
