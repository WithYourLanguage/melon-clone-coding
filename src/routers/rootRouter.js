import express from "express";
import { home, songLike } from "../controllers/songController";
import {
  getLogin,
  postLogin,
  getJoin,
  postJoin,
  logout,
  error404,
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
rootRouter.use("/", error404);

export default rootRouter;
