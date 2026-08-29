import { config } from 'dotenv';
config();

console.log('DIABUOAI AI agent runtime started');
console.log('Model:', process.env.OPENAI_MODEL ?? 'gpt-4o-mini');
