
import OpenAI from "openai";
import ApiError from "../errors/ApiErrors.js";

const OPENAI_API_KEY_API_KEY = process?.env?.OPENAI_API_KEY || ''
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY_API_KEY
});
const OPEN_AI_MODEL = "gpt-4o"


class OpenAIService {

  async getCompanyInsights(businessContent) {
    try {
        const socialMediaPerson = await this.socialMediaPerson()
        const understandBusinessPrompt = await this.understandBusinessPrompt(businessContent)
        const openAIResponse = await openai.chat.completions.create({
            model: OPEN_AI_MODEL,
            messages: [
                { role: "system", content: socialMediaPerson },
                {
                    role: "user", content: understandBusinessPrompt,
                },
            ],
        });
        
        // console.log(JSON.stringify(openAIResponse, null, 2))
        return openAIResponse.choices[0].message?.content;
    } catch (err) {
      console.error("An error occured when sending the prompt", { err });
      throw new ApiError("An internal server error occurred");
    }
  }


  async createCompanyExplanationPitch(companyInsights) {
    try {
      const socialMediaPerson = await this.socialMediaPerson()
      const prompt = await this.videoPrompt(companyInsights)

      const openAIResponse = await openai.chat.completions.create({
          model: OPEN_AI_MODEL,
          messages: [
            { role: "system", content: socialMediaPerson },
            {role: "user", content: prompt}
          ],
      });
      
      // console.log(JSON.stringify(openAIResponse, null, 2))
      return openAIResponse.choices[0].message?.content;
    } catch (err) {
      console.error("An error occured when sending the prompt", { err });
      throw new ApiError("An internal server error occurred");
    }
  }


  async createVideoSegments(companyExplanationPitch) {
    try {
      const socialMediaPerson = await this.socialMediaPerson()
      const prompt = await this.createVisualSegments(companyExplanationPitch)

      const openAIResponse = await openai.chat.completions.create({
          model: OPEN_AI_MODEL,
          messages: [
            // { role: "system", content: socialMediaPerson },
            {role: "user", content: prompt}
          ],
      });
      
      const res = JSON.parse(openAIResponse.choices[0].message?.content?.replace(/```json|```/g, '').trim())
      return res
    } catch (err) {
      console.error("An error occured when sending the prompt", { err });
      throw new ApiError("An internal server error occurred");
    }
  }

  




  async socialMediaPerson() {
    return `
        You are a highly skilled Social Media Marketing Manager with a keen understanding of brand storytelling, audience engagement, and digital strategies. Your goal is to create an impactful multimedia campaign to promote a client’s business through social media channels, such as Instagram, Facebook, TikTok, and LinkedIn. The client has provided their website, which you will analyze to extract key elements to showcase in the campaign.

        Your Task:
        Analyze the client's website to gather insights for a multimedia campaign. Create an engaging narrative that resonates with the target audience, leveraging the business's strengths and value proposition.

        Focus on:
        Business Overview:

        What products or services does the business offer?
        What makes this business unique compared to competitors?
        What are the core values and mission of the business?
        Target Audience:

        Who are the ideal customers of the business? (Consider demographics like age, interests, location, and pain points)
        What problems do these customers face, and how does the business solve them?
        Brand Voice and Messaging:

        What tone and style does the website use? (e.g., professional, casual, friendly, authoritative)
        How does the business want to be perceived by its audience?
        Key Features and Benefits:

        Identify the primary features of the product or service and how they benefit customers.
        How can you highlight these features in a visual and compelling way?
        Call to Action (CTA):

        What is the desired outcome of the campaign? (e.g., drive website traffic, generate leads, promote a specific product, increase brand awareness)
        What CTA would be most effective based on the website content and customer journey?
        Multimedia Elements:

        What visuals, videos, infographics, or animations can be used to explain the business and its offerings effectively?
        How can you create shareable and engaging content that fits the platform (e.g., short-form videos for TikTok, infographics for Instagram, blog links for LinkedIn)?
        Campaign Metrics:

        What are the success metrics for this campaign? (e.g., engagement rate, click-through rate, conversion rate)
        How can these metrics be tracked and optimized over time?
        Constraints:
        Budget: Stay within the client’s allocated budget for the multimedia campaign.
        Platform Optimization: Tailor content specifically for each social media platform to maximize engagement.
        Output:
        Present a detailed strategy for the multimedia campaign, including:

        Key messaging themes
        Suggested multimedia formats (videos, images, text, etc.)
        A proposed timeline for the campaign rollout
        Metrics to track campaign success
    `.trim()
  }

  async understandBusinessPrompt(businessContent) {
    return `
        Using the following context, respond in detail to the questions below, providing clear and accurate information about the project:

### Context: 
${businessContent}

---

Based on the information from the context:

1. **Project Location**: Where is the project located? Include specific details about the neighborhood or region.
2. **Unit Types**: What types of units are included in the project? Mention whether they are apartments, townhouses, or other kinds of units.
3. **Unit Sizes and Prices**: What are the minimum unit sizes and starting prices? Provide specific measurements (in square meters or feet) and prices (in local currency).
4. **Down Payment**: What is the minimum down payment required for purchasing a unit?
5. **Project Highlights**: Why does La Haus (LH) believe this is a great project to invest in? Highlight any unique selling points such as location advantages, project amenities, or potential return on investment. 
6. Benefits of buying throught La Haus.

    `.trim()
  }


  async videoPrompt(companyInformation) {
    return `
      You are an expert in audiovisual design, specializing in creating short, captivating showcase videos for residential construction projects, particularly condo apartment buildings. You work for La Haus.

Your task is to create a 30-second video script for a project listed on La Haus, adhering to a 440-character limit. Follow these steps carefully:

- Hook the viewer immediately with the project's standout features.
- Highlight the project's location (include both neighborhood and city).
- Present the minimum unit size, minimum price, and minimum downpayment (or "enganche" in Spanish).
- Briefly explain why La Haus recommends this project.
- Conclude with the key benefits of buying through La Haus.
- Before starting the script, analyze the data to determine the minimum price, minimum unit size, and minimum downpayment. List all prices, areas, and downpayments, then choose the lowest for each.

After generating the script, review your work as an auditor. Navigate to the provided URL to verify accuracy, correct any errors, and improve the script as needed. 
Ensure the final version adheres to the 440-character limit and is suitable for text-to-speech (TTS) synthesis without requiring captions or brackets.

Use the following content to product the script:

      ${companyInformation}
    `.trim()
  }



  async createVisualSegments(salesVideoPitch) {
   return `

   We want to generate a 30 second video based on the script below for a video of a new construction project listed in La Haus. The video should be divided into 6 segments of 5 seconds each. Propose 6 visuals for each of the 6 segments. YOU MUST AVOID the following types of visuals that image generation models struggle to generate: 
1. Text: Generating readable and accurate text (like signage, posters, or articles). 
2. Complex hands and fingers: Detailed hand gestures or natural hand positions often appear distorted. 
3. Crowds or large groups of people: Maintaining unique details for many people in the same scene is difficult. 
4. Logos or branded items: Replicating logos or specific brand symbols often results in inaccurate designs, also name and price tags. 
5. Highly detailed objects: Intricate mechanical parts or overlapping designs can appear messy. 
6. Uncommon perspectives: Complex angles (like top-down or fisheye) are sometimes distorted. 
7. Image collages: avoid several photos collaged in a single image. Each image must have only one photo.
8. Text and text banners
Make sure the descriptions of the images are consistent with the city and neighborhood where the project is located. E.g. If the project is located in Mexico City, the visuals should correspond to this city and shouldn’t include elements or landscapes not included in this city, like ocean, desert, monuments, etc… 
Use a format where each fragment of the script is associated with a description of visuals. It must be identical in structure and format to the following example from another different script.
 { "segments": [ { "script": "Meet Squire, your new AI-powered coding assistant.", "visuals": "A sleek, futuristic workspace with a laptop on a desk. The camera zooms in to show an AI interface smoothly appearing on the screen, signaling the introduction of the assistant. Soft lighting and clean design give a modern, tech-focused atmosphere." }, { "script": "Imagine super-fast code reviews, all done in under a minute!", "visuals": "A fast-paced sequence showing code being automatically reviewed on the screen, with progress bars moving quickly. The scene then transitions to a visual of a digital timer rapidly counting down from 60 seconds, highlighting speed." }, { "script": "Squire's smart Pull Request Summaries simplify your workflow, letting you focus on what truly matters.", "visuals": "A developer working calmly at their desk. The camera focuses on the screen showing a pull request summary in a clean, well-organized format. The background softly fades to emphasize the simplicity and clarity of the process." }, { "script": "And soon, engage in interactive code chats and enriched issue reviews, elevating your team's productivity to new heights.", "visuals": "A visual of a futuristic chat interface where the AI assistant and a developer are engaging in real-time conversation. The background transitions to show team members collaborating, reinforcing the idea of seamless interaction and productivity." }, { "script": "Ready to revolutionize your development process? Try Squire today and code smarter, not harder.", "visuals": "The camera zooms out to show a developer closing their laptop confidently in a bright, modern office. The scene ends with a wide shot of the workspace, with natural light streaming in, symbolizing productivity and success." } ] } 



    ${salesVideoPitch}
   `.trim()
  }
}

export default new OpenAIService();