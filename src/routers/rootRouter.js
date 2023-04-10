import express from "express";
import { home } from "../controllers/songController";
import { getLogin, postLogin, getJoin, postJoin } from "../controllers/userControllers";
import songRouter from "../routers/songRouter";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.use("/song", songRouter);

export default rootRouter;
