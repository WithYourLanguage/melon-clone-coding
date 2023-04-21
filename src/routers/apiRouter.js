import express from "express";
import {
  registerView,
  nextSong,
  songLike,
  playlistNextSong,
  registerViewGenre
} from "../controllers/songController";
import { protectorMiddleware } from "../middlewares";
const apiRouter = express.Router();

apiRouter.post("/song/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/song/:id([0-9a-f]{24})/view/genre", registerViewGenre)
apiRouter.post(
  "/song/:id([0-9a-f]{24})/next-song",
  protectorMiddleware,
  nextSong
);
apiRouter.post(
  "/song/:id([0-9a-f]{24})/next-song/play-list",
  protectorMiddleware,
  playlistNextSong
);
apiRouter.post("/song/:id([0-9a-f]{24})/like", songLike);

export default apiRouter;
