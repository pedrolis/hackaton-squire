import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import SiteService from '../../services/SiteService.js'

const route = Router();

export default app => {

  app.use("/site", route);
  
  route.post("/", async (req, res, next) => {
    try {
      const url_processed = await SiteService.processUrl(req?.body?.url)
      return res.json({
        ...url_processed,
        "status": "CREATED"
      }).status(StatusCodes.CREATED);
    } catch (err) {
      return next(err);
    }
  });

  route.get("/videos", async (req, res, next) => {
    try {
      const videos = await SiteService.getAllVideos()
      return res.json({
        videos
      })
      .status(StatusCodes.OK);
    } catch (err) {
      return next(err);
    }
  });

  route.get("/:id", async (req, res, next) => {
    try {
      const videos = await SiteService.getSiteVideos(req?.params?.id)
      const status = videos && videos.length ? "COMPLETED" : "PROCESSING"

      return res.json({
        "sc_id": req.params.id,
        status,
        "video_url": videos ? videos[0] : null,
        videos,
        "logo_url": null        
      }).status(StatusCodes.OK);
    } catch (err) {
      return next(err);
    }
  });
};
