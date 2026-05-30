import cron from 'node-cron';

cron.schedule('0 9 * * *', async () => {
  console.log('⏰ Running daily follow-up check...');
});

console.log('⏰ Cron jobs initialized');