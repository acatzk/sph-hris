export default () => ({
  queueHost: process.env.QUEUE_HOST || 'localhost',
  queuePort: process.env.QUEUE_PORT || 6379,
});
