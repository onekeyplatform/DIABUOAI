import { config } from 'dotenv';
config();

console.log('DIABUOAI workers started');
console.log('Redis:', process.env.REDIS_URL ?? 'redis://localhost:6379');
