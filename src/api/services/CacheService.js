const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
import { createClient } from 'redis';

class RedisService {
    constructor() {
      this.client = null;
    }
  
    // Initialize Redis connection and handle errors
    async init() {
      if (!this.client) {
        this.client = createClient({
          url: REDIS_URL
        });
  
        // Handle errors
        this.client.on('error', (err) => console.log('Redis Client Error', err));
  
        // Await connection
        await this.client.connect();
        console.log('Connected to Redis');
      }
  
      return this.client;
    }
  
    async get(key) {
      await this.init();
      return await this.client.get(key)
    }

    async set(key, value) {
        await this.init();
        await this.client.set(key, value);
    }
  }
  
  export default new RedisService();