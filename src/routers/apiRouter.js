import express from "express";
import {
  registerView,
  nextSong,
  songLike,
  playlistNextSong,
} from "../controllers/songController";
const apiRouter = express.Router();

apiRouter.post("/song/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/song/:id([0-9a-f]{24})/next-song", nextSong);
apiRouter.post("/song/:id([0-9a-f]{24})/next-song/play-list", playlistNextSong);
apiRouter.post("/song/:id([0-9a-f]{24})/like", songLike);
export default apiRouter;