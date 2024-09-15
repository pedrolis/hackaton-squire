import dotenv  from "dotenv"
dotenv.config()

import express from 'express'
const PORT = process?.env?.PORT || 3000

const app = express()
import cors from 'cors';
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

import api from "./src/api/routes/index.js";
app.use(api);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})



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