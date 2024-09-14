import dotenv  from "dotenv"
dotenv.config()

import express from 'express'
import FirecrawlApp from '@mendable/firecrawl-js'
import fs, { write } from 'node:fs'

const PORT = process?.env?.PORT || 3000

const FIRECRAWL_API_KEY = process?.env?.FIRECRAWL_API_KEY || ''
const firecrawlApp = new FirecrawlApp({apiKey: FIRECRAWL_API_KEY})



const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import api from "./src/api/routes/index.js";
app.use(api);



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})







async function crawlWebsite(websiteUrl) {
  // const mapResult = await firecrawlApp.mapUrl(websiteUrl);
  const scrapeResult = await firecrawlApp.scrapeUrl(websiteUrl, { 
    formats: ['markdown', 'html'] 
  });

  if (!scrapeResult.success) {
      throw new Error(`Failed to map: ${scrapeResult.error}`)
  }

  await write2File(websiteUrl, scrapeResult)
}

async function write2File(websiteUrl, content) {
  let promise = new Promise((resolve, reject) => {

    const filename = websiteUrl.replace(/\//g, '_')

    fs.writeFile(`debug.${filename}`, JSON.stringify(content, null, 2), err => {
      if (err) {
        console.error(`Error creating debug file: ${err}`);
      } else {
        console.log("Melori")
      }
    });
  });
  await promise;
}




function print (path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    console.log('%s /%s',
      layer.method.toUpperCase(),
      path.concat(split(layer.regexp)).filter(Boolean).join('/'))
  }
}

function split (thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash) {
    return ''
  } else {
    var match = thing.toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
    return match
      ? match[1].replace(/\\(.)/g, '$1').split('/')
      : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))