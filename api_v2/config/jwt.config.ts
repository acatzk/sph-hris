export default () => ({
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtSigningExpiration: process.env.JWT_SIGNING_EXPIRATION || '7d',
  jwtSigningAlgorithm: process.env.JWT_SIGNING_ALGORITHM || 'HS256',
});
