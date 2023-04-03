import express from "express";
import { home } from "../controllers/songController";
import songRouter from "../routers/songRouter";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.use("/song", songRouter);

export default rootRouter;
