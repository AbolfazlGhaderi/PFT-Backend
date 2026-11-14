export const THROTTLER_CONFIG = [
  {
    name: 'login',
    ttl: 60_000,
    limit: 5,
  },
  {
    name: 'default',
    ttl: 60_000,
    limit: 15,
  },
];
