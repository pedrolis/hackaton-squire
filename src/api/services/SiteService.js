
import { StatusCodes } from "http-status-codes";
import crypto from 'crypto'

import ApiError from "../errors/ApiErrors.js";
import CrawlService from "./CrawlService.js";
import OpenAIService from "./OpenAIService.js";
import CacheService from "./CacheService.js";

class SiteService {

  async processUrl(websiteUrl) {
    try {
      const sc_id = await crypto.createHash('md5').update(websiteUrl).digest("hex")
      console.log(`URL: ${websiteUrl}, MD5: '${sc_id}'`)

      let content = await CacheService.get(sc_id)

      console.log(`Retrieving from cache ${sc_id} the content`)
      if(content) {
        console.log(`MD5: '${sc_id}', is already on cache`)
      } else {
        console.log(`MD5: '${sc_id}', starting to crawl`)
        content = await CrawlService.crawlWebsite(websiteUrl)
        await CacheService.set(sc_id, content)
        console.log(`MD5: '${sc_id}', crawl finished`)
      }


      console.log(`MD5: '${sc_id}', Understanding business with OpenAI`)
      const companyInsights = await OpenAIService.getCompanyInsights(content)
      console.log(`MD5: '${sc_id}', Understanding business finished`)


      console.log(`MD5: '${sc_id}', Explanation video pitch with OpenAI`)
      const companyExplanationPitch = await OpenAIService.createCompanyExplanationPitch(companyInsights)
      console.log(`MD5: '${sc_id}', Explanation video pitch finished`)


      console.log(`MD5: '${sc_id}', Video Segments with OpenAI`)
      const videoSegments = await OpenAIService.createVideoSegments(companyExplanationPitch)
      console.log(`MD5: '${sc_id}', Video Segments finished`)


      const response = { sc_id, content, companyInsights, companyExplanationPitch, videoSegments }
      console.log(JSON.stringify(response))

      return response
    } catch (err) {
      console.error("An error occured when processing the website information.", { err });
      throw new ApiError("An internal server error occurred");
    }
  }
}

export default new SiteService();