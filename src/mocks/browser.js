import { setupWorker } from 'msw/browser'
import { handlers } from './handler';

export const worker = new setupWorker(...handlers); 
