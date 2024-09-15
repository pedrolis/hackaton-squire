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

    async lPush(queue, value) {
      await this.init();
      await this.client.lPush(queue, value)
    }

    async lRange(key, start=0, stop=-1) {
      await this.init();
      try {
        const elements = await this.client.lRange(key, 0, -1);
        console.log(`Elements for list ${key}:`, elements);
        return elements
      } catch (err) {
        console.error('Error fetching list elements:', err);
        return []
      } 
    }

    async keys(prefix) {
      await this.init();
      try {
        return await this.client.keys(prefix);
      } catch (err) {
        console.error('Error fetching list elements:', err);
      } 
      return []
    }
  }
  
  export default new RedisService();