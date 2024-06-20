module.exports = {
  apps: [
    {
      script: "server.js",
      watch: false,
      name: "server",
      exec_mode: "cluster",
      instances: 0,
      log_date_format: "YYYY-MM-DD HH:mm Z",
      env: {
        NODE_ENV: "production",
        TZ: "Asia/Kolkata",
      },
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy": "pm2 reload ecosystem.config.js",
      "pre-setup": "",
    },
  },
};
