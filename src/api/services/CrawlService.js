
import { StatusCodes } from "http-status-codes";
import ApiError from "../errors/ApiErrors.js";

import FirecrawlApp from '@mendable/firecrawl-js'
import fs, { write } from 'node:fs'
const FIRECRAWL_API_KEY = process?.env?.FIRECRAWL_API_KEY || ''
const firecrawlApp = new FirecrawlApp({apiKey: FIRECRAWL_API_KEY})

class CrawlService {

  async crawlWebsite(websiteUrl) {
    const scrapeResult = await firecrawlApp.scrapeUrl(websiteUrl, { 
      formats: ['markdown'] 
    });

    if (!scrapeResult.success) {
        throw new ApiError(`Failed to crawl ${websiteUrl}; error: ${scrapeResult.error}`)
    }

    console.log(JSON.stringify(scrapeResult))
    return scrapeResult.markdown
  }
}

export default new CrawlService();