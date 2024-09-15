import { LogoScrape } from 'logo-scrape';

class LogoService {

    async getWebsiteLogos(websiteUrl) {
      try {
        const logos = await LogoScrape.getLogos(websiteUrl);
        
        logos.sort((a, b) => {
          const isSvgA = a.url.includes('.svg');
          const isSvgB = b.url.includes('.svg');
          
          return isSvgB - isSvgA;
        });

        const logo = logos && logos.lenght ? logos[0] : null
        
        return { logo }
      } catch(err) {
        console.err(`Could not extract logos for ${websiteUrl}`, err);
      }
      return { logo: [], logos: [] }
    }
  }
  
  export default new LogoService();