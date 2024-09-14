import { Router } from "express";
import api from "./api.js";
import sites from "./site.js";

const v1 = Router();
api(v1);
sites(v1);

export default v1;