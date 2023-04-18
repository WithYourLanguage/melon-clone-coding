import express from "express";
import { home } from "../controllers/songController";
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
  logout,
} from "../controllers/userControllers";
import songRouter from "../routers/songRouter";
import { publicOnlyMiddleware, protectorMiddleware } from "../middlewares";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/logout", protectorMiddleware, logout);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter.use("/song", songRouter);

export default rootRouter;
