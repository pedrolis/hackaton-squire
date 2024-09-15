
import { StatusCodes } from "http-status-codes";
import crypto from 'crypto'

import ApiError from "../errors/ApiErrors.js";
import CrawlService from "./CrawlService.js";
import LogoService from "./LogoService.js";
import OpenAIService from "./OpenAIService.js";
import CacheService from "./CacheService.js";

class SiteService {

  async processUrl(websiteUrl) {
    try {
      const sc_id = await crypto.createHash('md5').update(websiteUrl).digest("hex")
      console.log(`URL: ${websiteUrl}, MD5: '${sc_id}'`)

      const contentKey = `content:${sc_id}`
      let content = await CacheService.get(contentKey)

      console.log(`Retrieving from cache ${contentKey} the content`)
      if(content) {
        console.log(`Key: '${contentKey}', is already on cache`)
      } else {
        console.log(`MD5: '${sc_id}', starting to crawl`)
        content = await CrawlService.crawlWebsite(websiteUrl)
        await CacheService.set(contentKey, content)
        console.log(`Key: '${contentKey}', crawl finished`)
      }

      const logos = await LogoService.getWebsiteLogos(websiteUrl);
      
      const companyPitch = await this.createCompanyPitch(sc_id, content)
      const audioText = companyPitch.videoSegments.segments.flatMap(item => `- ${item.script}`).join('\n');
      const videoPromptText = companyPitch.videoSegments.segments.flatMap(item => `- ${item.visuals}`).join('\n');
      const response = { sc_id, content, ...companyPitch, audioText, videoPromptText, logos }

      const processedKey = `processed:${sc_id}`
      await CacheService.set(processedKey, JSON.stringify(response))
      await CacheService.lPush('processed', sc_id)

      return response
    } catch (err) {
      console.error("An error occured when processing the website information.", { err });
      throw new ApiError("An internal server error occurred");
    }
  }

  async createCompanyPitch(sc_id, content) {
      console.log(`MD5: '${sc_id}', Understanding business with OpenAI`)
      const companyInsights = await OpenAIService.getCompanyInsights(content)
      console.log(`MD5: '${sc_id}', Understanding business finished`)


      console.log(`MD5: '${sc_id}', Explanation video pitch with OpenAI`)
      const companyExplanationPitch = await OpenAIService.createCompanyExplanationPitch(companyInsights)
      console.log(`MD5: '${sc_id}', Explanation video pitch finished`)


      console.log(`MD5: '${sc_id}', Video Segments with OpenAI`)
      const videoSegments = await OpenAIService.createVideoSegments(companyExplanationPitch)
      console.log(`MD5: '${sc_id}', Video Segments finished`)

      return { 
        companyInsights, 
        companyExplanationPitch, 
        videoSegments 
      }
  }

  async getSiteContent(sc_id) {
    try {
      // return await JSON.parse(CacheService.get(`processed:${sc_id}`))
      return {}
    } catch (err) {
      console.error(`Cannot get video list for ${sc_id}.`, { err });
    }
    return {}
  }

  async getSiteVideos(sc_id) {
    let videos = []
    try {
      const videoKey = `videos:${sc_id}`

      console.log(`Searching videos for: '${videoKey}'`)
      videos = await CacheService.lRange(videoKey) || []
      console.log(`Videos for '${videoKey}' [${videos.length}] '${videos}'`)
    } catch (err) {
      console.error(`Cannot get video list for ${sc_id}.`, { err });
    }
    return videos
  }

  async getAllVideos() {
    try {
        const videoKeys = await CacheService.keys(`videos:*`)

        let videos = []
        for (const key of videoKeys) {
          const siteVideos = await CacheService.lRange(key)
          videos = [...videos, ...siteVideos]
        }

        return videos
    } catch (err) {
      console.error(`Cannot get all video list for `, { err });
    }
    return []
  }
}

export default new SiteService();