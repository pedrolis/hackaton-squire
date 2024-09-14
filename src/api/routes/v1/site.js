import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import crypto from 'crypto'

const route = Router();

export default app => {

  app.use("/site", route);
  
  route.post("/", async (req, res, next) => {
    try {
      return res.json({
        "sc_id": crypto.createHash('md5').update(req.body.url).digest("hex"),
        "status": "CREATED"
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
