import { LogoScrape } from 'logo-scrape';

class LogoService {

    async getWebsiteLogos(websiteUrl) {
      try {
        const logos = await LogoScrape.getLogos(websiteUrl);
        


        return { logo, logos }
      } catch(err) {
        console.err(`Could not extract logos for ${websiteUrl}`, err);
      }
      return { logo: [], logos: [] }
    }
  }
  
  export default new LogoService();