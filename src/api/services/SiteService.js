
import { StatusCodes } from "http-status-codes";
import crypto from 'crypto'

import ApiError from "../errors/ApiErrors.js";
import CrawlService from "./CrawlService.js";

class SiteService {

  async processUrl(websiteUrl) {
    try {
      const sc_id = crypto.createHash('md5').update(websiteUrl).digest("hex")
      console.log(`URL: ${websiteUrl}, MD5: '${sc_id}'`)

      console.log(`MD5: '${sc_id}', starting to crawl`)
      const content = await CrawlService.crawlWebsite(websiteUrl)
      console.log(`MD5: '${sc_id}', crawl finished`)

      return { sc_id, content }
    } catch (err) {
      logger.error("An error occured when querying all users.", __filename, { err });
      throw new ApiError("An internal server error occurred");
    }
  }
}

export default new SiteService();