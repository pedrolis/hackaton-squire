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
        "sc_id": url_processed.sc_id,
        "status": "CREATED",
        "content": url_processed.content
      }).status(StatusCodes.CREATED);
    } catch (err) {
      return next(err);
    }
  });

  route.get("/:id", async (req, res, next) => {
    try {
      // const data = await UsersService.getUser(req.params.id);
      return res.json({
        "sc_id": req.params.id,
        "status": "SEARCHING",
        "content": null,
        "video_url": null,
        "logo_url": null        
      }).status(StatusCodes.OK);
    } catch (err) {
      return next(err);
    }
  });
};
