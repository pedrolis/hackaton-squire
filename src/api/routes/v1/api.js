import { Router } from "express";

const route = Router();

export default app => {

    app.use("/", route);

    route.get("/", async (req, res) => {
        return res.send("<h1>Welcome to Backend Starter v1.0.0!</h1>");
    });
};