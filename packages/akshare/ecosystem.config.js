module.exports = {
  apps: [
    {
      name: 'stock-akshare',
      // instances: 'max',
      // exec_mode: 'cluster',
      cwd: './',
      script: 'main.py',
      args: '--host 0.0.0.0 --port 8988',
      interpreter: 'python3',
      max_restarts: 3,
      // watch: ['./src'],
      // env: {},
      out_file: '/var/log/stock-akshare/out.log',
      err_file: '/var/log/stock-akshare/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
    }
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy': 'pip install -r requirements.txt && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
}
