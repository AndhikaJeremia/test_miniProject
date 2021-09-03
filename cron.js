const CronJob = require('cron').CronJob;
const Cron = require('./backup.js');


new CronJob(
  '*/10 * * * *',
  function() {
    Cron.backups();
  },
  null,
  true,
  'Asia/Jakarta'
);