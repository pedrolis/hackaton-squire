# Hackaton - Text2Video Backend Project

## Project Overview
This project is built for the Squire Hackaton and aims to convert text data from a provided URL into a video. The backend processes the input, utilizes external APIs and packages to generate video content, and supports deployment to Heroku.

### Features:
- **Data processing from URL**: Extracts data (text, logos) from a given URL.
- **Video Generation**: Transforms text into video content using AI-driven tools.
- **API Integration**: Leverages OpenAI and other APIs for content generation.
- **Deployed on Heroku**: Ready for deployment and scalable cloud hosting.

## Tech Stack
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for building REST APIs.
- **OpenAI API**: Used for generating text-based content for videos.
- **Redis**: Caching layer to improve performance.
- **Heroku**: Cloud platform for deploying the backend.

## Prerequisites

Before running the project, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Redis server (optional, but recommended for caching)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/hackaton-text2video.git
   cd hackaton-text2video
   ```


2. **Install dependencies:**

```bash
np` install
```


3. **Create environment variables:**

- Create a .env file in the root directory of your project.
- Add the required environment variables (API keys, Redis config, etc.).

Example .env file:

```env.local
OPENAI_API_KEY=your-openai-api-key
REDIS_URL=your-redis-url
```


4. **Run the server locally**: 
To run the app locally, use the nodemon script with the local environment file.

**License**
This project is licensed under the ISC License. See the LICENSE file for details.



